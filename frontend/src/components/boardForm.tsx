import { Controller, useForm } from "react-hook-form";
import { type BoardCreator } from "../lib/validation/board.creator.validation";
import Label from "./ui/label";
import Input from "./ui/input";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { addBoard } from "../store/slice/boardSlice";
import { closeHoverWindow } from "../store/slice/hoverWindowSlice";
import ModalFooter from "./ui/modalFooter";

function BoardForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm<BoardCreator>({
        defaultValues: {
            title: "",
            description: "",
            visibility: "Public",
        }
    });

    const dispatcher = useDispatch<AppDispatch>()

    const onSubmit = async (formData: BoardCreator) => {
        try {
            const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
            const response = await fetch(`${SERVER_PATH}/api/boards`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json();
            if (!response.ok) {
                setError("root", data.message);
            } else {
                dispatcher(addBoard({
                    _id: data.data._id,
                    title: data.data.title,
                    description: data.data.description,
                    visibility: data.data.visibility,
                    created_at: data.data.created_at,
                    updated_at: data.data.updated_at,
                }));
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
                    <Controller
                        control={control}
                        name="title"
                        render={({ field }) => <Input {...field} placeholder="Chat App" className="w-full" id="title" />}
                    />
                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => <Input {...field} placeholder="Defines the stuff that needed to be ...." className="w-full" id="description" />}
                    />
                    {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <div className="flex  gap-1">
                        <div className="flex gap-2 items-center">
                            <Controller
                                control={control}
                                name="visibility"
                                render={({ field }) => <Input type="radio" {...field} value="Public" id="visibility-public" />}
                            />
                            <Label htmlFor="visibility-public">Public</Label>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Controller
                                control={control}
                                name="visibility"
                                render={({ field }) => <Input type="radio" {...field} value="Private" id="visibility-private" />}
                            />
                            <Label htmlFor="visibility-private">Private</Label>
                        </div>
                    </div>
                    {errors.visibility && <p className="text-sm text-red-600">{errors.visibility.message}</p>}
                </div>
            </form>
            <ModalFooter
                onClose={() => dispatcher(closeHoverWindow())}
                submitText="Create Board"
                submitVariant="primary"
            />
        </div>
    )
}

export default BoardForm