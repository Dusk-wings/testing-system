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
  const [boardData, setBoardData] = React.useState<BoardData[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    error: boolean;
  } | null>(null);

  const fetchBoardData = async () => {
    setLoading(true);
    try {
      const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
      const response = await fetch(`${SERVER_PATH}/api/boards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.status === 200) {
        setBoardData(data.data);
      } else {
        setError({
          message: data.message,
          error: true,
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError({
        message: "Internal Server Error",
        error: true,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBoardData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Boards</h1>
      <section
        className={`${loading || error ? "justify-center items-center flex h-dvh w-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-dvh w-full"}`}
        aria-label="Boards"
      >
        {loading ? (
          <section
            className="flex justify-center items-center h-dvh w-full"
            aria-label="Loading"
          >
            <p className="text-center text-gray-500">Loading...</p>
          </section>
        ) : error ? (
          <section
            className="flex justify-center items-center h-dvh w-full"
            aria-label="Error"
          >
            <p className="text-center text-red-500">{error.message}</p>
          </section>
        ) : boardData?.length === 0 ? (
          <p className="text-center text-gray-500">
            No boards found, start by creating a board
          </p>
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
          ))
        )}
      </section>
    </div>
  );
}

export default BoardPage;
