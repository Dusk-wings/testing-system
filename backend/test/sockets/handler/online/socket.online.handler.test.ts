import { getAllOnlinePresence, getOnlinePresence } from "@src/sockets/features/online/online.handler";
import { onlineUserCount } from "@src/sockets/states/global.onlineCount.state";

jest.mock('@src/sockets/states/global.onlineCount.state', () => ({
    onlineUserCount: {
        get: jest.fn(),
        get size() {
            return 10;
        }
    }
}))

const mockOnlineUserCount = onlineUserCount as jest.Mocked<typeof onlineUserCount>;

describe('HANDLER -> online presence indicator', () => {
    it('should give true if the user is online', () => {
        const emitMock = jest.fn();
        const socket = {
            to: jest.fn(() => ({ emit: emitMock })),
            data: {
                user_id: 'u1'
            }
        } as any;

        mockOnlineUserCount.get.mockReturnValue(1);
        getOnlinePresence(socket, { user_id: 'u1' })

        expect(socket.to).toHaveBeenCalledWith("u1");
        expect(emitMock).toHaveBeenCalledWith(
            "online-presence",
            { user_id: "u1", online: true }
        );
    })

    it('should give false if the user is not online', () => {
        const emitMock = jest.fn();
        const socket = {
            to: jest.fn(() => ({ emit: emitMock })),
            data: {
                user_id: 'u1'
            }
        } as any;

        mockOnlineUserCount.get.mockReturnValue(0);
        getOnlinePresence(socket, { user_id: 'u1' })

        expect(socket.to).toHaveBeenCalledWith("u1");
        expect(emitMock).toHaveBeenCalledWith(
            "online-presence",
            { user_id: "u1", online: false }
        );
    })
})

describe("HANDLER -> get all user online count", () => {
    it('should return the count of all active users', () => {
        const emitMock = jest.fn();
        const socket = {
            to: jest.fn(() => ({ emit: emitMock })),
            data: {
                user_id: 'u1'
            }
        } as any;

        getAllOnlinePresence(socket)

        expect(socket.to).toHaveBeenCalledWith("u1");
        expect(emitMock).toHaveBeenCalledWith(
            "online-presence",
            { count: 10 }
        );
        expect(mockOnlineUserCount.size).toBe(10);
    })
})