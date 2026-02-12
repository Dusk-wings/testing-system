import { handelBoardJoin } from "@src/sockets/features/baord/board.handler";
import { handelListCreate, handelListDelete, handelListUpdate } from "@src/sockets/features/list/list.handler";

const socket = {
    emit: jest.fn(),
    join: jest.fn(),
    data: {
        user_id: "u1",
    }
} as any;

const emit = jest.fn();

const namespace = {
    to: jest.fn(() => ({ emit }))
} as any;


describe("HANDLE -> LIST", () => {

    beforeEach(() => {
        handelBoardJoin(namespace, socket, { boardId: "b1" })
    })

    it("Should send the created list data to the client", () => {

        const data = {
            title: "list1",
            board_id: "b1"
        }
        handelListCreate(namespace, socket, data);
        expect(namespace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith("list-created", { list: data });
    })

    it("Should send the deleted list data to the client", () => {
        const data = {
            list_id: "l1"
        }
        handelListDelete(namespace, socket, data);
        expect(namespace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith("list-deleted", { list_id: data.list_id });
    })

    it("Should send the updated list data to the client", () => {
        const data = {
            list_id: "l1",
            title: "list1",
            board_id: "b1"
        }
        handelListUpdate(namespace, socket, data);
        expect(namespace.to).toHaveBeenCalledWith("b1");
        expect(emit).toHaveBeenCalledWith("list-updated", { list: data });
    })
})