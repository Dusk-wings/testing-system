import React from "react";
import ContentCard from "../../../../components/ui/contentCard";
import Button from "../../../../components/ui/button";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import { OpenFor, setOpen } from "../../../../store/slice/hoverWindowSlice";

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

  const dispatcher = useDispatch<AppDispatch>();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Boards</h1>
        <Button variant="primary" onClick={() => {
          dispatcher(setOpen({
            open: true,
            heading: "Create Board",
            headingDescription: "Create a new board",
            type: OpenFor.BOARD_CREATION,
          }));
        }}>
          Create
        </Button>
      </div>
      <section
        className={`${loading || error || boardData?.length === 0 ? "justify-center items-center flex h-96 w-full" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-dvh w-full"}`}
        aria-label="Boards"
      >
        {loading ? (
          <section
            className="flex justify-center items-center w-full"
            aria-label="Loading"
          >
            <p className="text-center text-gray-500">Loading...</p>
          </section>
        ) : error ? (
          <section
            className="flex justify-center items-center  w-full"
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
