import Board from "@src/models/board.model"
import { getBoard } from "@src/services/board.services"

jest.mock("@src/models/board.model", () => ({
    __esModule: true,
    default: {
        find: jest.fn()
    }
}))

const boardMocked = Board as jest.Mocked<typeof Board>

describe("Get board service", () => {
    it("should return all boards", async () => {
        boardMocked.find.mockResolvedValue([])
        const boards = await getBoard("1");
        expect(boards.status).toBe(200);
        expect(boards.data).toEqual([]);
        expect(boards.message).toBe("Boards fetched successfully");
    })
})