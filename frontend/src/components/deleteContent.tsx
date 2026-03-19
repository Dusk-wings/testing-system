import { OpenFor } from "../store/slice/hoverWindowSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import { closeHoverWindow, setOpen } from "../store/slice/hoverWindowSlice";
import ModalFooter from "./ui/modalFooter";
import type { RootState } from "../store/store";
import { removeCard, removeList } from "../store/slice/currentData";
import { useNavigate } from "react-router";



function DeleteContent() {

    const hoverState = useSelector((state: RootState) => state.hoverWindow);

    const dispatcher = useDispatch<AppDispatch>();
    const BOARD_DELETE = `/api/boards/${hoverState.data?.id}`
    const CARD_DELETE = `/api/tasks/${hoverState.data?.id}`
    const LIST_DELETE = `/api/lists/${hoverState.data?.list_id}`

    const navigator = useNavigate()

    const deleteContent = async () => {
        // console.log(CARD_DELETE)
        try {
            let PATH = import.meta.env.VITE_BACKEND_PATH;
            if (hoverState.type == 'BOARD_DELETION') {
                PATH += BOARD_DELETE;
            } else if (hoverState.type == 'CARD_DELETION') {
                PATH += CARD_DELETE;
            } else if (hoverState.type == 'LIST_DELETION') {
                PATH += LIST_DELETE;
            }
            const response = await fetch(PATH, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(response)
            const data = await response.json();
            if (!response.ok) {
                console.error(data.data);
                dispatcher(setOpen({
                    open: true,
                    type: OpenFor.ERROR,
                    heading: "Error",
                    headingDescription: `Error deleting content, ${data.message}`,
                }))
            } else {
                console.log(data.data)
                dispatcher(closeHoverWindow());
                if (hoverState.type == 'LIST_DELETION') {
                    dispatcher(removeList(data.data._id))
                } else if (hoverState.type == 'CARD_DELETION') {
                    dispatcher(removeCard({ list_id: data.data.list_id, card_id: data.data._id }))
                } else {
                    navigator("/dashboard", { replace: true })
                }
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
