import Button from "./button";

interface Props {
    onClose: () => void;
    onSubmit?: () => void;
    submitText?: string;
    submitVariant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | undefined;
}

function ModalFooter({ onClose, onSubmit, submitText, submitVariant }: Props) {
    return (
        <footer className="w-full flex md:flex-row flex-col gap-2">
            <Button
                className="grow"
                variant="danger"
                onClick={onClose}
            >
                Close
            </Button>
            <Button
                form="form"
                className="grow"
                type="submit"
                onClick={onSubmit}
                variant={submitVariant}
            >
                {submitText ? submitText : "Done"}
            </Button>
        </footer>
    )
}

export default ModalFooter