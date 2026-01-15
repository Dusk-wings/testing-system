import Board from "@src/models/board.model"

export const getBoard = async (user_id: string) => {
    try {
        const board = await Board.find({ user_id: user_id })
        return {
            status: 200,
            message: "Boards fetched successfully",
            data: board
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Internal Server Error"
        }
    }
}

export const createBoard = async ({ user_id, title, visibility }: { user_id: string, title: string, visibility: string }) => {
    try {
        await Board.create({ user_id, title, visibility })
        return {
            status: 201,
            message: "Board created successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Internal Server Error"
        }
    }
}

export const updateBoard = async ({ user_id, board_id, title, visibility }: { user_id: string, board_id: string, title?: string, visibility?: string }) => {
    try {
        const update: any = {}
        if (title) update.title = title
        if (visibility) update.visibility = visibility
        update.updatedAt = new Date()

        await Board.updateOne({ _id: board_id, user_id: user_id }, { $set: update }, { runValidators: true })
        return {
            status: 200,
            message: "Board updated successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Internal Server Error"
        }
    }
}

export const deleteBoard = async (data: { user_id: string, board_id: string }) => {
    try {
        if (!data.board_id) {
            return {
                status: 400,
                message: "Board id is required"
            }
        }

        await Board.deleteOne({ user_id: data.user_id, _id: data.board_id })
        return {
            status: 200,
            message: "Board deleted successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: "Internal Server Error"
        }
    }
}