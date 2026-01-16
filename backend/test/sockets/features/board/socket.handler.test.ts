import { handelBoardJoin } from "@src/sockets/features/baord/board.handler";
import { boardUsersMap } from "@src/sockets/states/global.boardUsers.state";

describe('board handler', () => {
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
})