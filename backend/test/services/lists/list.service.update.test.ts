import List from "@src/models/list.model"
import { updateList } from "@src/services/list.services"

jest.mock('@src/models/list.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        updateMany: jest.fn()
    }
}))


const mockedListModel = List as jest.Mocked<typeof List>

describe("List Service Update", () => {
    const NOW = 1_700_000_000_000;
    beforeEach(() => {
        jest.spyOn(Date, "now").mockReturnValue(NOW);
    })

    it("should update a list, if provided data is correct", async () => {
        mockedListModel.findOne.mockResolvedValue({
            user_id: "user_id",
            title: "List 1",
            position: 1,
            board_id: "board_id",
            created_at: NOW,
            updated_at: NOW,
        } as any);
        mockedListModel.findOneAndUpdate.mockResolvedValue({
            user_id: "user_id",
            title: "List 1",
            position: 2,
            board_id: "board_id",
            created_at: NOW,
            updated_at: NOW,
        } as any);
        mockedListModel.updateMany.mockResolvedValue({ modifiedCount: 1 } as any);

        const result = await updateList({
            user_id: "user_id",
            list_id: "list_id",
            board_id: "board_id",
            title: "List 1",
            position: 2
        });

        expect(result.status).toBe(200)
        expect(result.message).toBe("List updated successfully")
        expect(result.data).toBeDefined()
        expect(mockedListModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: "list_id", user_id: "user_id" },
            { $set: { title: "List 1", position: 2, updated_at: NOW } },
            { runValidators: true }
        )
        expect(mockedListModel.updateMany).toHaveBeenCalledWith(
            {
                board_id: "board_id",
                position: {
                    $gte: 1,
                    $lte: 2
                }
            },
            {
                $inc: { position: -1 }
            }
        )
    })

    it("should not update a list, if list is not found", async () => {
        mockedListModel.findOne.mockResolvedValue(null);
        const result = await updateList({
            user_id: "user_id",
            list_id: "list_id",
            board_id: "board_id",
            title: "List 1",
            position: 2
        });
        expect(result).toEqual({
            status: 404,
            message: "List not found",
        })
    })
})