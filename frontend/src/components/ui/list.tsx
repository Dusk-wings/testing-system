import type { Card } from "../../lib/types/board";
import Button from "./button";
import { Plus } from "lucide-react";
import Task from "./task";
import OptionsMenu from "./optionMenu";
import { setOpen } from "../../store/slice/hoverWindowSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { updateListPosition } from "../../store/slice/currentData";

interface Props {
    title: string;
    cards: Card[];
    list_id: string;
    board_id: string;
    operation: () => void;
    position: number;
    totalLists: number;
}

function List({ title, cards, list_id, board_id, operation, position, totalLists }: Props) {
    const dispatch = useDispatch<AppDispatch>();

    const moveList = async (direction: 'left' | 'right' | 'up' | 'down') => {
        if (direction === 'left' && position === 1) return;
        if (direction === 'right' && position === totalLists) return;

        if (direction === 'up' || direction == 'down') return;

        try {
            const newPosition = direction === 'left' ? position - 1 : position + 1;
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const data = await fetch(`${SERVER_PATH}/api/lists`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    list_id,
                    board_id,
                    position: newPosition,
                    direction
                })
            });
            const response = await data.json();
            if (data.ok) {
                dispatch(
                    updateListPosition({
                        list_id,
                        position: response.data.position,
                        prevPosition: response.data.prevPosition
                    })
                )
            } else {
                dispatch(setOpen({
                    open: true,
                    type: 'ERROR',
                    data: null,
                    heading: 'Unable to relocate the list!!',
                    headingDescription: response.message
                }))
            }
        } catch (error) {
            console.log(error);
            dispatch(setOpen({
                open: true,
                type: 'ERROR',
                data: null,
                heading: 'Unable to relocate the list!!',
                headingDescription: error ? String(error) : 'Something went wrong'
            }))
        }

    }

    return (
        <div
            className="flex flex-col gap-2 min-h-fit  max-h-96 w-96 bg-purple-200 rounded-xl p-4 flex-shrink-0"
            aria-label="list-content"
            role="region"
        >
            <div className="flex justify-between items-center">
                <h2>{title}</h2>
                <div id="button-section" className="flex gap-1">
                    <Button onClick={operation}>
                        <Plus />
                    </Button>
                    <OptionsMenu
                        popOverFor="List"
                        move={moveList}
                        editFunction={() => {
                            dispatch(setOpen({
                                open: true,
                                type: 'LIST_UPDATION',
                                data: {
                                    list_id,
                                    board_id,
                                    title
                                },
                                heading: 'Update List',
                                headingDescription: 'State the content that need to be changed'
                            }))
                        }}
                        deleteFunction={() => {
                            dispatch(setOpen({
                                open: true,
                                type: 'LIST_DELETION',
                                data: {
                                    list_id,
                                    board_id,
                                },
                                heading: 'Delete List',
                                headingDescription: 'Are you sure you want to delete this list?',
                            }))
                        }}
                    />
                </div>
            </div>
            <section className="flex flex-1 flex-col gap-4  p-2 rounded-xl overflow-y-auto w-full min-h-0" >
                {cards.length === 0 ? (
                    <p className="text-sm text-center">
                        No cards, start by creating a card
                    </p>
                ) : cards.map((card: Card) => {
                    return (
                        <Task
                            key={card._id}
                            heading={card.title}
                            body={card.description}
                            deadling={card.deadline}
                            task_id={card._id}
                            list_id={card.list_id}
                            board_id={card.board_id}
                            currentPosition={card.position}
                            totalCard={cards.length}
                            listPositon={position}
                            totalList={totalLists}
                        />
                    );
                })}
            </section>
        </div>
    );
}

export default List;