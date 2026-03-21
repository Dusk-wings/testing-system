import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { Controller, useForm } from "react-hook-form";
import { type ListCreator } from "../lib/validation/list.creator.validation";
import Label from "./ui/label";
import Input from "./ui/input";
import ModalFooter from "./ui/modalFooter";
import { closeHoverWindow, setOpen } from "../store/slice/hoverWindowSlice";
import { addList, updateList } from "../store/slice/currentData";


function ListForm() {
    const dispatch = useDispatch<AppDispatch>();
    const dataRecived = useSelector((state: RootState) => state.hoverWindow.data);
    const openFor = useSelector((state: RootState) => state.hoverWindow.type);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset
    } = useForm<ListCreator>(
        {
            defaultValues: {
                title: ""
            }
        }
    )

    React.useEffect(() => {
        if (openFor == 'LIST_UPDATION') {
            reset({
                title: dataRecived?.title as string
            })
        }
    }, [openFor])

    const onSubmit = async (data: ListCreator) => {
        try {
            if (openFor == 'LIST_UPDATION' &&
                (!data.title
                    || data.title == dataRecived?.title
                    || !dataRecived?.list_id
                )
            ) return;


            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const response = await fetch(`${SERVER_PATH}/api/lists`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: openFor == 'LIST_UPDATION' ? "PUT" : "POST",
                body: JSON.stringify(openFor == 'LIST_UPDATION' ?
                    {
                        ...data,
                        list_id: dataRecived?.list_id,
                        board_id: dataRecived?.board_id
                    } : {
                        ...data,
                        board_id: dataRecived?.board_id
                    }),
                credentials: "include"
            })
            const responseData = await response.json();
            if (!response.ok) {
                dispatch(setOpen({
                    type: "ERROR",
                    open: true,
                    heading: "Unabel to create the list",
                    headingDescription: responseData.message,
                }))
            } else {
                if (openFor == 'LIST_CREATION') {
                    dispatch(addList({
                        title: responseData.data.title,
                        _id: responseData.data._id,
                        position: responseData.data.position,
                        board_id: responseData.data.board_id,
                        updated_at: responseData.data.updated_at,
                        created_at: responseData.data.created_at,
                        cards: []
                    }))
                } else {
                    dispatch(updateList({
                        _id: responseData.data._id,
                        title: responseData.data.title,
                        position: responseData.data.position,
                        board_id: responseData.data.board_id,
                        updated_at: responseData.data.updated_at,
                        created_at: responseData.data.created_at,
                    }))
                }
                dispatch(closeHoverWindow())
            }
        } catch (error) {
            console.log(error);
            dispatch(setOpen({
                type: "ERROR",
                heading: "Unabel to create the list",
                headingDescription: "",
                open: true
            }))
        }
    }

    return (
        <div className="flex flex-col gap-4 w-64">
            <form id="form" onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="flex gap-2 flex-col w-full">
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    <Label htmlFor="title">Title</Label>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <Input
                                id="title"
                                type="text"
                                placeholder="List Title"
                                className="w-full"
                                {...field}
                            />
                        )}
                    />
                </div>
            </form>
            <ModalFooter
                onClose={() =>
                    dispatch(closeHoverWindow())
                }
                submitText={openFor == 'LIST_CREATION' ? "Create List" : "Update List"}
                submiting={isSubmitting}
            />
        </div>
    )
}

export default ListForm;