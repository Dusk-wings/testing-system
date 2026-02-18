import { OpenFor } from "../store/slice/hoverWindowSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { closeHoverWindow, setOpen } from "../store/slice/hoverWindowSlice";
import ModalFooter from "./ui/modalFooter";


interface Props {
    type: OpenFor,
    id: string
}

function DeleteContent({ type, id }: Props) {
    const dispatcher = useDispatch<AppDispatch>();
    const BOARD_DELETE = `/api/boards/${id}`
    const CARD_DELETE = `/api/cards/${id}`

    const deleteContent = async () => {
        try {
            let PATH = import.meta.env.VITE_BACKEND_PATH;
            if (type == 'BOARD_DELETION') {
                PATH += BOARD_DELETE;
            } else if (type == 'CARD_DELETION') {
                PATH += CARD_DELETE;
            }
            const response = await fetch(PATH, {
                method: "DELETE",
                credentials: "include",
            })
            const data = await response.json();
            if (!response.ok) {
                console.error(data.message);
                dispatcher(setOpen({
                    open: true,
                    type: OpenFor.ERROR,
                    heading: "Error",
                    headingDescription: `Error deleting content, ${data.message}`,
                }))
            } else {
                dispatcher(closeHoverWindow());
            }
        } catch (error) {
            dispatcher(setOpen({
                open: true,
                type: OpenFor.ERROR,
                heading: "Error",
                headingDescription: "Network Error, Please try again later",
            }))
            console.error(error);
        }
    }


    return (
        <>
            <ModalFooter
                onClose={() => dispatcher(closeHoverWindow())}
                submitText="Delete"
                submitVariant="danger"
                onSubmit={deleteContent}
            />
        </>
    )
}

export default DeleteContent
