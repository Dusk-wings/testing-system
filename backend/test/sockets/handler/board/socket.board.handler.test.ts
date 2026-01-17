import { handelBoardJoin, handelBoardLeave } from "@src/sockets/features/baord/board.handler";
import { boardUsersMap } from "@src/sockets/states/global.boardUsers.state";

describe('HANDLER -> board join', () => {
    it('should emit a board joined event', () => {
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

        handelBoardJoin(nameSpace, socket, { boardId: 'b1' })

        expect(nameSpace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith(
            "user-connected-to-board",
            { user: "u1" }
        );

        expect(boardUsersMap.get("b1")?.has("u1")).toBe(true);
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

        handelBoardJoin(nameSpace, socket, { boardId: '' })

        expect(socket.emit).toHaveBeenCalledWith(
            "error",
            { message: "Board ID is required" }
        );
    })
})

describe('HANDLER -> board leave', () => {
    it('should emit a board left event', () => {
        const socket = {
            leave: jest.fn(),
            to: jest.fn(() => ({ emit: jest.fn() })),
            data: {
                user_id: 'u1',
                board_id: 'b1',
            },
        } as any;

        const emit = jest.fn();

        const nameSpace = {
            to: jest.fn(() => ({ emit })),
        } as any;

        handelBoardLeave(nameSpace, socket)

        expect(nameSpace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith(
            "user-disconnected-from-board",
            { user: "u1" }
        );

        expect(boardUsersMap.get("b1")?.has("u1")).toBe(false || undefined);
        expect(socket.leave).toHaveBeenCalledWith("b1");
    })
})
