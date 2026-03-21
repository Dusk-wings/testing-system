import { Controller, useForm } from "react-hook-form";
import { type BoardCreator } from "../lib/validation/board.creator.validation";
import Label from "./ui/label";
import Input from "./ui/input";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { addBoard, updateBoard } from "../store/slice/boardSlice";
import { closeHoverWindow, setOpen } from "../store/slice/hoverWindowSlice";
import ModalFooter from "./ui/modalFooter";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import React from "react";

function BoardForm() {
    const hoverWindow = useSelector((state: RootState) => state.hoverWindow);
    const boardData = useSelector((state: RootState) => state.board.boards);

    const [currentBoardData, setCurrentBoardData] = React.useState<BoardCreator | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        reset
    } = useForm<BoardCreator>({
        defaultValues: {
            title: "",
            description: "",
            visibility: "Public",
        }
    });
    const [isLoading, setIsLoading] = React.useState(true)

    const getBoardData = async (board_id?: string) => {
        if (!board_id || board_id == '') return;
        setIsLoading(true);
        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const data = await fetch(`${SERVER_PATH}/api/boards/${board_id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'Content-type': 'application/json'
                }
            })
            const result = await data.json();
            if (data.ok) {
                setCurrentBoardData(result.data);
                reset({
                    title: result.data.title,
                    description: result.data.description,
                    visibility: result.data.visibility,
                })
            } else {
                dispatcher(setOpen({
                    type: "ERROR",
                    open: true,
                    heading: "ERROR",
                    headingDescription: result.message
                }))
            }
        } catch (error) {
            dispatcher(setOpen({
                type: "ERROR",
                open: true,
                heading: "Error",
                headingDescription: 'Unable to get the board data'
            }))
        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        if (hoverWindow.type == 'BOARD_UPDATION') {
            if (boardData.length > 0) {
                const board = boardData.find((board) => board._id === hoverWindow.data?.id);
                if (board) {
                    setCurrentBoardData(board);
                    reset({
                        title: board.title,
                        description: board.description,
                        visibility: board.visibility,
                    });
                    setIsLoading(false)
                }
            } else {
                getBoardData(hoverWindow.data?.id as string);
            }
        } else {
            setIsLoading(false);
        }
    }, [hoverWindow, boardData])

    const dispatcher = useDispatch<AppDispatch>()

    const onSubmit = async (formData: BoardCreator) => {
        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const URL = '/api/boards';

            const dataToSend: any = {
                board_id: hoverWindow.data?.id,
            }

            if (hoverWindow.type == 'BOARD_UPDATION') {
                if (
                    formData.title == currentBoardData?.title
                    && formData.description == currentBoardData?.description
                    && formData.visibility == currentBoardData?.visibility
                ) {
                    dispatcher(closeHoverWindow());
                    return;
                }

                if (formData.title != currentBoardData?.title) {
                    dataToSend.title = formData.title;
                }
                if (formData.description != currentBoardData?.description) {
                    dataToSend.description = formData.description;
                }
                if (formData.visibility != currentBoardData?.visibility) {
                    dataToSend.visibility = formData.visibility;
                }
            }

            const response = await fetch(`${SERVER_PATH}${URL}`, {
                method: hoverWindow.type == 'BOARD_CREATION'
                    ? "POST"
                    : "PUT",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    hoverWindow.type == 'BOARD_CREATION' ? formData : dataToSend
                )
            })
            const data = await response.json();
            if (!response.ok) {
                setError("root", data.message);
            } else {
                if (hoverWindow.type == 'BOARD_CREATION') {
                    dispatcher(addBoard({
                        _id: data.data._id,
                        title: data.data.title,
                        description: data.data.description,
                        visibility: data.data.visibility,
                        created_at: data.data.created_at,
                        updated_at: data.data.updated_at,
                    }));
                } else {
                    dispatcher(updateBoard({
                        _id: data.data._id,
                        title: formData.title,
                        description: formData.description,
                        visibility: formData.visibility,
                        created_at: data.data.created_at,
                        updated_at: data.data.updated_at,
                    }));
                }
                dispatcher(closeHoverWindow());
            }
        } catch (error) {
            console.error(error);
            setError("root", {
                message: "Something went wrong",
            });
        }
    }

    return (
        <div className="p-2 w-full">

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-92" id="form">
                {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="title">Title</Label>
                    {isLoading ?
                        <div className="w-full h-10 bg-zinc-200 animate-pulse rounded-lg"></div>
                        :
                        <Controller
                            control={control}
                            name="title"
                            render={({ field }) =>
                                <Input
                                    {...field}
                                    placeholder="Chat App"
                                    className="w-full"
                                    id="title"
                                />
                            }
                        />}
                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Description</Label>
                    {isLoading ?
                        <div className="w-full h-10 bg-zinc-200 animate-pulse rounded-lg"></div>
                        :
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) =>
                                <Input
                                    {...field}
                                    placeholder="Defines the stuff that needed to be ...."
                                    className="w-full"
                                    id="description"
                                />
                            }
                        />}
                    {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <div className="flex  gap-1">
                        <Controller
                            control={control}
                            name="visibility"
                            render={({ field }) => (
                                <>
                                    <div className="flex gap-2 items-center">
                                        {isLoading ?
                                            <div className="w-4 h-4 bg-zinc-200 animate-pulse rounded-full"></div>
                                            :
                                            <Input
                                                type="radio"
                                                checked={field.value === "Public"}
                                                {...field}
                                                value="Public"
                                                id="visibility-public"
                                            />}

                                        <Label
                                            htmlFor="visibility-public"
                                        >
                                            Public
                                        </Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {isLoading ?
                                            <div className="w-4 h-4 bg-zinc-200 animate-pulse rounded-full"></div>
                                            : <Input
                                                type="radio"
                                                checked={field.value === "Private"}
                                                {...field}
                                                value="Private"
                                                id="visibility-private"
                                            />}
                                        <Label
                                            htmlFor="visibility-private"
                                        >
                                            Private
                                        </Label>
                                    </div>
                                </>
                            )}
                        />
                    </div>
                    {errors.visibility && <p className="text-sm text-red-600">{errors.visibility.message}</p>}
                </div>
            </form>
            <ModalFooter
                onClose={() => dispatcher(closeHoverWindow())}
                submitText={hoverWindow.type == 'BOARD_CREATION' ? "Create Board" : "Update Board"}
                submitVariant="primary"
            />
        </div>
    )
}

export default BoardForm