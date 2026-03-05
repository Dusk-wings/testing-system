import Button from "./button";
import Loader from "./loader";

interface Props {
    onClose: () => void;
    onSubmit?: () => void;
    submitText?: string;
    submitVariant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | undefined;
    submiting?: boolean
}

function ModalFooter({ onClose, onSubmit, submitText, submitVariant, submiting }: Props) {
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
                {submiting ? <Loader /> : submitText ? submitText : "Done"}
            </Button>
        </footer>
    )
}

export default ModalFooter