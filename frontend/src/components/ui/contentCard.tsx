import { Card, CardBody, CardFooter, CardHeader } from "./card";
import { Link } from "react-router";
import Button from "./button";

interface Props {
    className?: string;
    to?: string;
    contentHeading: string;
    contentDescription: string;
    contentImage?: string;
    contentImageAlt?: string;
    visibilityStatus?: string;
    lastUpdated?: string;
}

function ContentCard({
    className,
    to,
    contentHeading,
    contentDescription,
    contentImage,
    contentImageAlt,
    visibilityStatus,
    lastUpdated
}: Props) {

    return (
        <Link to={to || "#"} className="cursor-pointer">
            <Card className={`dark:bg-gray-800/50 bg-amber-400/50 hover:bg-blend-overlay hover:scale-105 transition-all duration-300 ${className} flex flex-col gap-2 bg-[url('${contentImage}')] bg-cover bg-center`}>
                <CardHeader className="dark:text-white text-black">
                    <h2 className="text-xl font-semibold">
                        {contentHeading}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">
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
                    <Button variant="outline" className="dark:text-white text-black">Edit</Button>
                    <Button variant="primary" className="dark:text-white text-black">Open</Button>
                </CardFooter>
            </Card>
        </Link>
    )
}

export default ContentCard