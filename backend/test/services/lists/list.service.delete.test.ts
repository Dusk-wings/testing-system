import List from "@src/models/list.model";
import { deleteList } from "@src/services/list.services";

jest.mock('@src/models/list.model', () => ({
    __esModule: true,
    default: {
        findOneAndDelete: jest.fn()
    }
}));

const mockedListModel = List as jest.Mocked<typeof List>;

describe("List Service Delete", () => {
    it("should delete a list, if provided data is correct", async () => {
        mockedListModel.findOneAndDelete.mockResolvedValue({
            _id: "1",
            board_id: "1",
            title: "List 1",
            position: 1,
            created_at: Date.now(),
            updated_at: Date.now(),
        } as any);

        const data = {
            list_id: "1",
            user_id: "1",
        }
        const result = await deleteList(data);

        expect(result.status).toBe(200);
        expect(result.message).toBe("List deleted successfully");

    })

    it("should not delete a list, if list is not found", async () => {
        mockedListModel.findOneAndDelete.mockResolvedValue(null);

        const data = {
            list_id: "1",
            user_id: "1",
        }
        const result = await deleteList(data);

        expect(result.status).toBe(404);
        expect(result.message).toBe("List not found");
    })
})