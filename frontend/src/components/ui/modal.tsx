import React from "react";

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
        <dialog ref={dialogRef}>
            <section>
                <h1>{heading}</h1>
                <p>{headingDescription}</p>
            </section>
            <div>{children}</div>
            <footer>
                <button onClick={() => onOpenChange(false)}>Close</button>
            </footer>
        </dialog>
    )
}

export default Modal