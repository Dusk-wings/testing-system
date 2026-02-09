import Board from "@src/models/board.model"
import List from "@src/models/list.model"

export const createList = async ({ title, boardId, user_id }: { title: string, boardId: string, user_id: string }) => {
    try {
        const doesUserOwnsTheBoard = await Board.findOne({ _id: boardId, user: user_id });
        if (!doesUserOwnsTheBoard) {
            return { status: 403, message: "You don't own this board" };
        }

        try {
            const numberOfList = await List.countDocuments({ board_id: boardId });

            const newList = await List.create({
                board_id: boardId,
                title: title,
                position: numberOfList + 1,
                created_at: Date.now(),
                updated_at: Date.now(),
            });

            return { status: 201, message: "List created successfully", data: newList };

        } catch (error) {
            console.log(error);
            return { status: 500, message: "Internal server error" };
        }

    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal server error" };
    }
}

export const updateList = async ({ title, listId, user_id, position }: { title?: string, listId: string, user_id: string, position?: number }) => {

    const dataToUpdate: any = {
        updated_at: Date.now(),
    }

    if (title) dataToUpdate.title = title
    if (position) dataToUpdate.position = position


    try {
        const list = await List.findOne({ _id: listId, user_id: user_id })
        if (!list) {
            return { status: 404, message: "List not found" };
        }
        if (position) {
            if (position < dataToUpdate.position) {
                await List.updateMany(
                    {
                        board_id: listId,
                        position: {
                            $gt: position,
                            $lte: dataToUpdate.position
                        }
                    },
                    {
                        $inc: { position: -1 }
                    }
                )
            } else if (position > dataToUpdate.position) {
                await List.updateMany(
                    {
                        board_id: listId,
                        position: {
                            $lt: position,
                            $gte: dataToUpdate.position
                        }
                    },
                    {
                        $inc: { position: 1 }
                    }
                )
            }
        }
        const updatedList = await List.findOneAndUpdate({ _id: listId, user_id: user_id }, { $set: dataToUpdate }, { runValidators: true });

        if (!updatedList) {
            return { status: 404, message: "List not found" };
        }
        return { status: 200, message: "List updated successfully", data: updatedList };
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal server error" };
    }

}

export const deleteList = async ({ listId, user_id }: { listId: string, user_id: string }) => {
    try {
        const deletedList = await List.findOneAndDelete({ _id: listId, user_id: user_id });
        if (!deletedList) {
            return { status: 404, message: "List not found" };
        }
        return { status: 200, message: "List deleted successfully", data: deletedList };
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Internal server error" };
    }

}