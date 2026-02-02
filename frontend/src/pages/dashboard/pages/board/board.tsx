import React from "react";
import ContentCard from "../../../../components/ui/contentCard";

interface BoardData {
    _id: string;
    title: string;
    description: string;
    visibility: string;
    created_at: string;
    updated_at: string;
}

function BoardPage() {
    const [boardData, setBoardData] = React.useState<
        BoardData[] | null
    >(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<{
        message: string,
        error: boolean
    } | null>(null)

    const fetchBoardData = async () => {
        setLoading(true)
        try {
            const SERVER_PATH = process.env.VITE_BACKEND_PATH
            const response = await fetch(`${SERVER_PATH}/api/v1/board`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            const data = await response.json()
            if (data.status === 200) {
                setBoardData(data.data)
            } else {
                setError({
                    message: data.message,
                    error: true
                })
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setError({
                message: "Internal Server Error",
                error: true
            })
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchBoardData()
    }, []);

    return (
        <div>
            <h1>Boards</h1>
            <div className={`${loading || error ? "justify-center items-center flex h-dvh w-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-dvh w-full"}`}>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error.message}</p>
                ) : (
                    boardData?.length === 0 ? (
                        <p>No boards found</p>
                    ) : (
                        boardData?.map((board) => (
                            <ContentCard
                                key={board._id}
                                to={`/dashboard/board/${board._id}`}
                                contentHeading={board.title}
                                contentDescription={board.description}
                                visibilityStatus={board.visibility}
                                lastUpdated={board.updated_at}
                            />
                        )))
                )}
            </div>
        </div>
    );
}

export default BoardPage;
