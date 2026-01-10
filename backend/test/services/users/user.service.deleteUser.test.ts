import UserModel from "@src/models/user.model";
import { deleteUser } from "@src/services/user.services";
import bcrypt from 'bcrypt'

jest.mock('@src/models/user.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        deleteOne: jest.fn(),
    }
}))

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}))

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const bcryptMocked = bcrypt.compare as jest.Mock

describe('deleteUser', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    afterEach(() => jest.clearAllMocks())
    it('should delete user, if the password matches', async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1", name: "John Doe", email: "john.doe@example.com", password: "hashed-password" } as any);
        mockUserModel.deleteOne.mockResolvedValue({ name: "Richard Roe" } as any);
        bcryptMocked.mockResolvedValue(true)

        const result = await deleteUser({ user_id: "1", password: 'password' })
        expect(result.status).toBe(200)
        expect(result.message).toBe("User Deleted")
    })

    it('should not delete user, if the password does not match', async () => {
        mockUserModel.findOne.mockResolvedValue({ id: "1", name: "John Doe", email: "john.doe@example.com", password: "hashed-password" } as any);
        mockUserModel.deleteOne.mockResolvedValue({ name: "Richard Roe" } as any);
        bcryptMocked.mockResolvedValue(false)

        const result = await deleteUser({ user_id: "1", password: 'password' })
        expect(result.status).toBe(401)
        expect(result.message).toBe("Invalid Password")
    })

    it('should not delete user, if the user does not exist', async () => {
        mockUserModel.findOne.mockResolvedValue(null);

        const result = await deleteUser({ user_id: "1", password: 'password' })
        expect(result.status).toBe(404)
        expect(result.message).toBe("User not found")
    })
})