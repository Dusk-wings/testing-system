import { Server } from "socket.io";
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import initSocket from "@src/sockets";
import { onlineUserCount } from "@src/sockets/states/global.onlineCount.state";
import UserModel from "@src/models/user.model";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    }
}))

jest.mock('@src/sockets/states/global.onlineCount.state', () => ({
    onlineUserCount: {
        get: jest.fn(),
        get size() {
            return 10;
        },
        set: jest.fn(),
    }
}))

const mockOnlineMap = onlineUserCount as jest.Mocked<typeof onlineUserCount>;
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

describe('NAMESPACE -> online', () => {
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
            client = Client(`http://localhost:${port}`, {
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

    it('should give true if the user is online', () => {
        mockOnlineMap.get.mockReturnValue(1);
        client.emit('get-online-presence', { user_id: 'u1' })

        client.on('online-presence', (payload: { user_id: string, isOnline: boolean }) => {
            expect(payload).toEqual({ user_id: 'u1', isOnline: true })
        })
    })

    it('should give false if the user is offline', () => {
        mockOnlineMap.get.mockReturnValue(undefined);
        client.emit('get-online-presence', { user_id: 'u1' })

        client.on('online-presence', (payload: { user_id: string, isOnline: boolean }) => {
            expect(payload).toEqual({ user_id: 'u1', isOnline: false })
        })
    })

    it('should give the online presence of all users', () => {
        client.emit('get-all-online-presence')

        client.on('all-online-presence', (payload: { user_id: string, isOnline: boolean }[]) => {
            expect(payload).toEqual([{ user_id: 'u1', isOnline: true }])
        })
    })


})