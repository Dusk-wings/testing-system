import MessageModel from "@src/models/message.model";
import UserModel from "@src/models/user.model";
import { handelBoardChatJoin, handelBoardChatCommunication, handelBoardChatLeave } from "@src/sockets/features/boardChat/boardChat.handler";
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
    },
}))

jest.mock('@src/sockets/states/global.boardUsers.state', () => ({
    boardUsersMap: {
        get: jest.fn()
    }
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockMessageModel = MessageModel as jest.Mocked<typeof MessageModel>;

const mockBoardUserMap = boardUsersMap as jest.Mocked<typeof boardUsersMap>;

describe('HANDLER -> board chat join', () => {
    it('should emit a board chat joined event', () => {
        const socket = {
            join: jest.fn(),
            data: {
                user_id: 'u1',
            },
        } as any;

        const emit = jest.fn();

        const nameSpace = {
            to: jest.fn(() => ({ emit })),
        } as any;

        handelBoardChatJoin(nameSpace, socket, { board_id: 'b1' })

        expect(nameSpace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith(
            "user-joined-chat",
            { user: "u1" }
        );

        expect(socket.join).toHaveBeenCalledWith("b1");
    })

    it('should emit error if board id is not supplied', () => {
        const socket = {
            emit: jest.fn(),
            data: {
                user_id: 'u1',
            },
        } as any;

        const nameSpace = {} as any;

        handelBoardChatJoin(nameSpace, socket, { board_id: '' })

        expect(socket.emit).toHaveBeenCalledWith(
            "error",
            { message: "Board ID is required" }
        );
    })
})

describe('HANDLER -> board chats', () => {
    it('should send the message if recived', async () => {
        mockUserModel.findById.mockResolvedValue({
            name: 'u1'
        })
        mockMessageModel.create.mockResolvedValue({
            _id: 'm1',
            message: 'message',
            user_id: 'u1',
            board_id: 'b1',
            created_at: '12/12/12'
        } as any)

        mockBoardUserMap.get.mockReturnValue(new Map([['u1', 1]]))
        const emitMock = jest.fn();
        const socket = {
            data: {
                user_id: 'u1',
                board_id: 'b1',
            },
        } as any;

        const nameSpace = {
            to: jest.fn(() => ({ emit: emitMock })),
        } as any;

        await handelBoardChatCommunication(nameSpace, socket, { message: 'message' })

        expect(nameSpace.to).toHaveBeenCalledWith("b1");
        expect(emitMock).toHaveBeenCalledWith(
            "board-message",
            { user_id: "u1", message: "message", userName: "u1", createdAt: "12/12/12", message_id: "m1" }
        );
    })

    it('should throw error if the message is not supplied', () => {
        const socket = {
            emit: jest.fn(),
            data: {
                user_id: 'u1',
                board_id: 'b1',
            }
        } as any;

        const nameSpace = {

        } as any;

        handelBoardChatCommunication(nameSpace, socket, { message: '' })

        expect(socket.emit).toHaveBeenCalledWith(
            "error",
            { message: "Message is required" }
        );
    })
})

describe('HANDLER -> board chats leave', () => {
    it('should emit a board chat left event', () => {
        const socket = {
            leave: jest.fn(),
            data: {
                user_id: 'u1',
                board_id: 'b1',
            },
        } as any;

        const emit = jest.fn();

        const nameSpace = {
            to: jest.fn(() => ({ emit })),
        } as any;

        handelBoardChatLeave(nameSpace, socket)

        expect(nameSpace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith(
            "user-left-chat",
            { user_id: "u1" }
        );

        expect(socket.leave).toHaveBeenCalledWith("b1");
    })
})  