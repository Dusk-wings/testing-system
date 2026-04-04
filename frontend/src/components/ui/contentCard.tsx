import { Card, CardBody, CardFooter, CardHeader } from "./card";
import Button from "./button";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { OpenFor, setOpen } from "../../store/slice/hoverWindowSlice";

interface Props {
    className?: string;
    to?: string;
    contentHeading: string;
    contentDescription: string;
    contentImage?: string;
    contentImageAlt?: string;
    visibilityStatus?: string;
    lastUpdated?: string;
    id: string;
}

function ContentCard({
    className,
    to,
    contentHeading,
    contentDescription,
    contentImage,
    // contentImageAlt,
    visibilityStatus,
    lastUpdated,
    id
}: Props) {

    const navigate = useNavigate()
    const dispatcher = useDispatch<AppDispatch>()

    return (
        // <Link to={to || "#"} className="cursor-pointer">
        <Card className={`dark:bg-gray-800/50 bg-amber-400/50 hover:bg-blend-overlay transition-all duration-300 ${className} grid grid-rows-3  bg-[url('${contentImage}')] bg-cover bg-center`} data-testid={contentHeading}>
            <CardHeader className="dark:text-white text-black">
                <h2 className="text-xl font-semibold">
                    {contentHeading}
                </h2>
                <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2">
                    {contentDescription}
                </p>
            </CardHeader>
            <CardBody className="flex justify-between items-center">
                <p className="bg-green-600 text-white px-2 py-1 rounded-xl text-sm">
                    {visibilityStatus}
                </p>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                    {lastUpdated}
                </p>
            </CardBody>
            <CardFooter className="flex items-center justify-between gap-2">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="dark:text-white text-black"
                        onClick={() => dispatcher(setOpen({
                            open: true,
                            heading: 'Edit Board',
                            headingDescription: "Enter the details to update",
                            type: OpenFor.BOARD_UPDATION,
                            data: {
                                id: id
                            }
                        }))}
                        data-testid={`edit-board-${contentHeading}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        className="dark:text-white text-black"
                        onClick={() => dispatcher(setOpen({
                            open: true,
                            heading: 'Delete Board',
                            headingDescription: `Are you sure you want to delete "${contentHeading}"?`,
                            type: OpenFor.BOARD_DELETION,
                            data: {
                                id: id
                            }
                        }))}
                        data-testid={`delete-board-${contentHeading}`}
                    >
                        Delete
                    </Button>
                </div>
                <Button
                    variant="primary"
                    className="dark:text-white text-black"
                    onClick={() => navigate(to || "#")}
                >
                    Open
                </Button>
            </CardFooter>
        </Card>
        // </Link>
    )
}

export default ContentCard