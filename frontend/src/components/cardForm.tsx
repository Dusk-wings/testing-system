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
import { zodResolver } from "@hookform/resolvers/zod";
import { cardValidator } from "../lib/validation/card.creator.validation";

function CardForm() {
    const {
        register,
        control,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm<CardCreator>({
        resolver: zodResolver(cardValidator),
        defaultValues: {
            title: "",
            deadline: new Date(),
            description: ""
        }
    });
    const dataRecived = useSelector((state: RootState) => state.hoverWindow.data);
    const openFor = useSelector((state: RootState) => state.hoverWindow.type);
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: CardCreator) => {
        console.log(data)
        if (!dataRecived?.list_id
            || !dataRecived?.board_id) return;

        console.log(dataRecived)

        console.log('Is moving in')
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
                console.log(responseData.data)
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
        <div className="flex flex-col gap-4 min-w-64 w-96">
            <form id="form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
                <div >
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
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
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
                <div className="flex gap-4 items-center">
                    {errors.deadline && <p className="text-red-500 text-sm">{errors.deadline.message}</p>}
                    <Label htmlFor="deadline">Deadline</Label>
                    <input
                        id="deadline"
                        type="date"
                        className="bg-purple-100 p-2 rounded-xl"
                        {...register("deadline", { valueAsDate: true })}
                    />
                </div>
            </form>
            <ModalFooter
                onClose={() => dispatch(closeHoverWindow())}
                submitText="Create Card"
                submiting={isSubmitting}
            />
        </div>
    )
}

export default CardForm