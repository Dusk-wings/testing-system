import React from "react";
import Button from "./button";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    heading: string;
    headingDescription: string;
    children: React.ReactNode;
}

function Modal({
    open,
    onOpenChange,
    heading,
    headingDescription,
    children
}: Props) {
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    React.useEffect(() => {
        if (!dialogRef.current) return;

        if (open && !dialogRef.current.open) {
            dialogRef.current?.showModal();
        } else if (!open && dialogRef.current.open) {
            dialogRef.current?.close();
        }
    }, [open]);

    return (
        <dialog ref={dialogRef} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl font-mono dark:bg-zinc-800 dark:text-white">
            <section>
                <h1 className="text-xl font-semibold">{heading}</h1>
                <p className="text-xs">{headingDescription}</p>
            </section>
            <div>{children}</div>
            <footer className="w-full flex md:flex-row flex-col gap-2">
                <Button className="grow" variant="danger" onClick={() => onOpenChange(false)}>Close</Button>
                <Button form="form" className="grow" type="submit" >Done</Button>
            </footer>
        </dialog>
    )
}

export default Modal