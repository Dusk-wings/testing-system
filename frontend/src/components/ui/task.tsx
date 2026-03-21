import Button from "./button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setOpen } from "../../store/slice/hoverWindowSlice";
import OptionsMenu from "./optionMenu";
import { updateCardPosition } from "../../store/slice/currentData";

interface Props {
    heading: string,
    body: string,
    deadling: string,
    task_id: string,
    list_id: string,
    board_id: string,
    currentPosition: number,
    totalCard: number,
    listPositon: number,
    totalList: number
}

function Task({
    heading,
    body,
    deadling,
    task_id,
    list_id,
    board_id,
    currentPosition,
    totalCard,
    listPositon,
    totalList
}: Props) {

    const dispatch = useDispatch<AppDispatch>()
    const currentData = useSelector((state: RootState) => state.currentData)

    const editFunction = () => { }
    const deleteFunction = () => { }
    const moveCard = async (direction: 'left' | 'right' | 'up' | 'down') => {
        if (direction == 'up' && currentPosition == 1) return;
        if (direction == 'down' && currentPosition == totalCard) return;

        if (direction == 'left' && listPositon == 1) return;
        if (direction == 'right' && listPositon == totalList) return;

        let target_list_id = list_id;
        if (direction == 'left') {
            target_list_id = currentData.board.lists.find(list => list.position == listPositon - 1)?._id || '';
        }
        if (direction == 'right') {
            target_list_id = currentData.board.lists.find(list => list.position == listPositon + 1)?._id || '';
        }

        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const data = await fetch(`${SERVER_PATH}/api/tasks/position`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    task_id,
                    list_id: target_list_id,
                    board_id,
                    position: direction == 'up' ?
                        currentPosition - 1 :
                        direction == 'down' ?
                            currentPosition + 1 :
                            0,
                    movement: direction == 'left'
                        || direction == 'right' ? 'move'
                        : 'reorder',
                })
            });
            const response = await data.json();
            if (data.ok) {
                dispatch(
                    updateCardPosition({
                        task_id,
                        position: response.data.position,
                        prevPosition: response.data.prevPosition,
                        list_id,
                        movement: direction == 'down' || direction == 'up' ? 'vertical' : 'horizontal',
                        target_list_id: response.data.list_id
                    })
                )
            } else {
                dispatch(setOpen({
                    open: true,
                    type: 'ERROR',
                    data: null,
                    heading: 'Unable to relocate the card!!',
                    headingDescription: response.message
                }))
            }
        } catch (error) {
            console.log(error);
            dispatch(setOpen({
                open: true,
                type: 'ERROR',
                data: null,
                heading: 'Unable to relocate the card!!',
                headingDescription: error ? String(error) : 'Something went wrong'
            }))
        }

    }

    return (
        <div
            className="flex flex-col gap-4 bg-purple-100 rounded-xl p-2"
            aria-label="task-content"
            role="region"
        >
            <section id="content" className="flex justify-between items-start">
                <div id="test-contnet">

                    <h3 className="text-lg font-semibold">{heading}</h3>
                    <p className="text-sm line-clamp-2">{body}</p>
                    <p className="text-xs text-zinc-700">
                        <span className="font-semibold">Deadline :</span>
                        <span>{deadling}</span>
                    </p>
                </div>
                <OptionsMenu
                    editFunction={editFunction}
                    deleteFunction={deleteFunction}
                    popOverFor="Card"
                    move={moveCard}
                />
            </section>
            <section id="buttons" className="flex justify-between items-center">
                <Button
                    variant="danger"
                    aria-label="delete-card"
                    onClick={() => dispatch(setOpen({
                        type: "CARD_DELETION",
                        open: true,
                        heading: 'Are you sure ?',
                        headingDescription: `Are you sure you want to delete card with heading "${heading}"`,
                        data: {
                            id: task_id,
                            list_id,
                            board_id
                        }
                    }))}
                >
                    Delete
                </Button>
                <Button
                    variant="primary"
                    aria-label="edit-card"
                    onClick={() => dispatch(setOpen({
                        type: "CARD_UPDATION",
                        open: true,
                        heading: 'Edit Card',
                        headingDescription: `Edit card with heading "${heading}"`,
                        data: {
                            task_id,
                            list_id,
                            board_id,
                            title: heading,
                            description: body,
                            deadline: deadling
                        }
                    }))}
                >
                    Edit
                </Button>
            </section>
        </div>
    )
}

export default Task;