import { Edit, Trash, EllipsisVertical, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { Popover } from "radix-ui";

interface Props {
    editFunction: () => void;
    deleteFunction: () => void;
    popOverFor: 'List' | 'Card';
    move: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

function OptionsMenu({ editFunction, deleteFunction, popOverFor, move }: Props) {

    return (
        <Popover.Root>
            <Popover.Trigger
                id="option-button"
                aria-label="options"
                className="cursor-pointer hover:shadow-xl shadow-purple-100 hover:scale-105">
                <EllipsisVertical />
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    role="region"
                    aria-label="popover"
                    className="bg-zinc-200/80 flex flex-col text-sm w-36 p-2 rounded-lg" >
                    {popOverFor === 'List' && <> <Popover.Close asChild>
                        <button
                            onClick={editFunction}
                            className="flex items-center gap-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                            aria-label="edit"
                        >
                            <Edit size={20} /> Edit
                        </button>
                    </Popover.Close>
                        <Popover.Close asChild>
                            <button
                                onClick={deleteFunction}
                                className="flex items-center gap-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                                aria-label="delete"
                            >
                                <Trash size={20} /> Delete
                            </button>
                        </Popover.Close></>}
                    <>
                        <Popover.Close asChild>
                            <button
                                onClick={() => move && move('left')}
                                className="flex items-center gap-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                                aria-label="left"
                            >
                                <ArrowLeft size={20} />  Left
                            </button>
                        </Popover.Close>
                        <Popover.Close asChild>
                            <button
                                onClick={() => move && move('right')}
                                className="flex items-center gap-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                                aria-label="right"
                            >
                                <ArrowRight size={20} />  Right
                            </button>
                        </Popover.Close>
                    </>
                    {
                        popOverFor === 'Card' && (
                            <>
                                <Popover.Close asChild>
                                    <button
                                        onClick={() => move && move('up')}
                                        className="flex items-center gap-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                                        aria-label="up"
                                    >
                                        <ArrowUp size={20} />  Up
                                    </button>
                                </Popover.Close>
                                <Popover.Close asChild>
                                    <button
                                        onClick={() => move && move('down')}
                                        className="flex items-center gap-2 hover:bg-white p-2 rounded-lg cursor-pointer"
                                        aria-label="down"
                                    >
                                        <ArrowDown size={20} />  Down
                                    </button>
                                </Popover.Close>
                            </>
                        )
                    }
                    <Popover.Arrow className="PopoverArrow" />
                </ Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )


}

export default OptionsMenu;