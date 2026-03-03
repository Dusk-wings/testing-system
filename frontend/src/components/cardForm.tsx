import { Controller, useForm } from "react-hook-form";
import { type CardCreator } from "../lib/validation/card.creator.validation";
import Label from "./ui/label";
import Input from "./ui/input";
import { useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { addCard, updateCard } from "../store/slice/currentData";
import ModalFooter from "./ui/modalFooter";
import { closeHoverWindow, setOpen } from "../store/slice/hoverWindowSlice";

function CardForm() {
    const { register, control, handleSubmit } = useForm<CardCreator>();
    const dataRecived = useSelector((state: RootState) => state.hoverWindow.data);
    const openFor = useSelector((state: RootState) => state.hoverWindow.type);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: CardCreator) => {
        if (!dataRecived?.list_id
            || !dataRecived?.board_id
            || !dataRecived?.position) return;

        const dataToSend: any = {
            list_id: dataRecived.list_id,
            board_id: dataRecived.board_id,
        };
        if (openFor == 'CARD_UPDATION') {
            if (!dataRecived.task_id) return;
            dataToSend.task_id = dataRecived.task_id;
            if (data.title != dataRecived.title)
                dataToSend.title = data.title;
            if (data.description != dataRecived.description)
                dataToSend.description = data.description;
            if (data.deadline != dataRecived.deadline)
                dataToSend.deadline = data.deadline;

        }

        const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
        const response = await fetch(`${SERVER_PATH}/api/tasks`, {
            method: openFor == 'CARD_UPDATION' ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(openFor == 'CARD_UPDATION' ?
                dataToSend : {
                    list_id: dataRecived.list_id,
                    board_id: dataRecived.board_id,
                    title: data.title,
                    description: data.description,
                    deadline: data.deadline,
                    status: "Todo"
                }),
            credentials: "include",
        });

        const responseData = await response.json();
        if (response.ok) {
            if (openFor == 'CARD_UPDATION') {
                dispatch(updateCard(responseData.data))
            } else {
                dispatch(addCard(responseData.data))
            }
            dispatch(closeHoverWindow());
        } else {
            console.error(responseData);
            dispatch(setOpen({
                type: "ERROR",
                heading: "Unable to Preform Operation",
                headingDescription: responseData.message,
                data: null,
                open: true
            }))
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="title"
                                placeholder="Card Title"
                                {...field}
                            />
                        )}
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="description"
                                placeholder="Card Description"
                                {...field}
                            />
                        )}
                    />
                </div>
                <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <input
                        id="deadline"
                        type="date"
                        {...register("deadline")}
                    />
                </div>
            </form>
            <ModalFooter
                onClose={() => dispatch(closeHoverWindow())}
                submitText="Create Card"
            />
        </div>
    )
}

export default CardForm