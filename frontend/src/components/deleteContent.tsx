import { OpenFor } from "../store/slice/hoverWindowSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import { closeHoverWindow, setOpen } from "../store/slice/hoverWindowSlice";
import ModalFooter from "./ui/modalFooter";
import type { RootState } from "../store/store";



function DeleteContent() {

    const hoverState = useSelector((state: RootState) => state.hoverWindow);

    const dispatcher = useDispatch<AppDispatch>();
    const BOARD_DELETE = `/api/boards/${hoverState.data?.id}`
    const CARD_DELETE = `/api/cards/${hoverState.data?.id}`

    const deleteContent = async () => {
        try {
            let PATH = import.meta.env.VITE_BACKEND_PATH;
            if (hoverState.type == 'BOARD_DELETION') {
                PATH += BOARD_DELETE;
            } else if (hoverState.type == 'CARD_DELETION') {
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
