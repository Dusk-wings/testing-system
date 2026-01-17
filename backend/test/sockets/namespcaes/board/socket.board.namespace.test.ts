import initSocket from "@src/sockets";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import { createServer } from "http"
import { Server } from "socket.io"
import { io as Client } from "socket.io-client"
import UserModel from "@src/models/user.model";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn()
    }
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe('NAMESPACE -> board', () => {
    let server: any;
    let io: Server;
    let client: any;
    beforeEach((done) => {
        mockUserModel.findById.mockResolvedValue({ _id: 'u1' })

        server = createServer();
        io = new Server(server, {
            cors: {
                origin: "http://localhost",
                credentials: true,
            },
        });
        initSocket(io);

        const [accessToken] = accessTokenGenrator('u1')

        server.listen(() => {
            const port = server.address().port;
            client = Client(`http://localhost:${port}/board`, {
                // transports: ['polling'],
                extraHeaders: {
                    Cookie: `access_token=${accessToken}`,
                },
            });
            client.on("connect", done);
            client.on("connect_error", done);

        })
    })

    afterEach(() => {
        io.close();
        client.close();
        server.close();
    })

    it('should emit a board joined event', (done) => {

        client.emit("connect-to-board", { boardId: "b1" });

        client.on("user-connected-to-board", (payload: { user: string }) => {
            expect(payload).toEqual({ user: "u1" });
            done();
        })

    })

    it('should emit a board left event', (done) => {
        client.emit("connect-to-board", { boardId: "b1" });

        client.once("user-connected-to-board", () => {
            client.emit("leave-board");
        });

        client.on("user-disconnected-from-board", (payload: { user: string }) => {
            expect(payload).toEqual({ user: "u1" });
            done();
        })

    })
})