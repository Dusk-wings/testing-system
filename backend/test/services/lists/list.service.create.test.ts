import List from "@src/models/list.model"
import Board from "@src/models/board.model"
import { createList } from "@src/services/list.services"

jest.mock('@src/models/list.model', () => ({
    __esModule: true,
    default: {
        create: jest.fn(),
        countDocuments: jest.fn()
    }
}))

jest.mock('@src/models/board.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn()
    }
}))

const mockedListModel = List as jest.Mocked<typeof List>
const mockedBoardModel = Board as jest.Mocked<typeof Board>

describe("List Service Create", () => {
    const NOW = 1_700_000_000_000;

    beforeEach(() => {
        jest.spyOn(Date, "now").mockReturnValue(NOW);
    });

    it("should create a list, if provided data is correct", async () => {

        mockedListModel.create.mockResolvedValue({
            user_id: "1",
            title: "List 1",
            createdAt: NOW,
            updatedAt: NOW,
            board_id: "1"
        } as any)
        mockedBoardModel.findOne.mockResolvedValue({
            user_id: "1",
            title: "Board 1",
            createdAt: NOW,
            updatedAt: NOW,
            visibility: "Public"
        } as any)
        mockedListModel.countDocuments.mockResolvedValue(0)

        const data = {
            user_id: "1",
            title: "List 1",
            board_id: "1"
        }

        const result = await createList(data)

        expect(result.status).toBe(201)
        expect(result.message).toBe("List created successfully");
        expect(mockedListModel.create).toHaveBeenCalledWith({
            board_id: "1",
            title: "List 1",
            position: 1,
            created_at: NOW,
            updated_at: NOW,
        })
    })

    it("should not create a list, if board is not found", async () => {
        mockedBoardModel.findOne.mockResolvedValue(null)

        const data = {
            user_id: "1",
            title: "List 1",
            board_id: "1"
        }

        const result = await createList(data)

        expect(result.status).toBe(403)
        expect(result.message).toBe("You don't own this board")
    })

})