import { Server } from "socket.io";
import UserModel from "@src/models/user.model";
import MessageModel from "@src/models/message.model";
import { createServer } from "http";
import { io as Client } from "socket.io-client";
import { accessTokenGenrator } from "@src/utils/accessTokenGenrator";
import initSocket from "@src/sockets";
import { boardUsersMap } from "@src/sockets/states/global.boardUsers.state";

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    }
}))

jest.mock('@src/models/message.model', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
    }
}))

const mockHas = jest.fn();

jest.mock('@src/sockets/states/global.boardUsers.state', () => ({
    boardUsersMap: {
        get: jest.fn(() => ({
            has: mockHas,
        })),
    },
}));


const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockMessageModel = MessageModel as jest.Mocked<typeof MessageModel>;
const mockBoardUsersMap = boardUsersMap as jest.Mocked<typeof boardUsersMap>;

describe('NAMESPACE -> board chat', () => {
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
            client = Client(`http://localhost:${port}/board-chat`, {
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

    it('should emit a board chat event', (done) => {
        client.emit("connect-to-board-chat", { board_id: "b1" });

        client.on("user-joined-chat", (payload: { user: string }) => {
            expect(payload).toEqual({ user: "u1" });
            done();
        })
    })

    it('should not emit a board chat event if board id is not provided', (done) => {
        client.emit("connect-to-board-chat", { board_id: "" });

        client.on("error", (payload: { message: string }) => {
            expect(payload).toEqual({ message: "Board ID is required" });
            done();
        })
    })

    it('should emit a board chat message event', (done) => {
        const now = Date.now();
        mockUserModel.findById.mockResolvedValue({ _id: 'u1', name: 'John Doe' } as any)
        mockMessageModel.create.mockResolvedValue({
            _id: 'm1',
            content: 'hello',
            sender: 'u1',
            board: 'b1',
            created_at: now
        } as any)
        mockBoardUsersMap.get.mockReturnValue(new Map([['u1', 5]]))
        mockHas.mockReturnValue(true)
        client.emit("connect-to-board-chat", { board_id: "b1" });

        client.once("user-joined-chat", () => {
            client.emit("board-chat-message", { message: "hello" });
        })

        client.on("board-message", (payload: {
            user_id: string,
            userName: string,
            message: string,
            createdAt: Date,
            message_id: string
        }) => {
            expect(payload.user_id).toBe('u1');
            expect(payload.userName).toBe('John Doe');
            expect(payload.message).toBe('hello');
            expect(payload.message_id).toBe('m1');
            expect(payload.createdAt).toBe(now);
            done();
        })
    })

    it('should not emit a board chat message event if the message is not supplied', (done) => {
        client.emit("connect-to-board-chat", { board_id: "b1" });

        client.once("user-joined-chat", () => {
            client.emit("board-chat-message", { message: "" });
        })

        client.on("error", (payload: { message: string }) => {
            expect(payload).toEqual({ message: "Message is required" });
            done();
        })
    })

    it('should emit the board chat leave event', (done) => {
        client.emit("connect-to-board-chat", { board_id: "b1" });

        client.once("user-joined-chat", () => {
            client.emit("leave-chat");
        })

        client.on("user-left-chat", (payload: { user_id: string }) => {
            expect(payload).toEqual({ user_id: "u1" });
            done();
        })
    })
})