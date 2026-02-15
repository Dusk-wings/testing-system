import React from "react";
import ContentCard from "../../../../components/ui/contentCard";
import Button from "../../../../components/ui/button";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";
import { OpenFor, setOpen } from "../../../../store/slice/hoverWindowSlice";
import { getBoardData } from "../../../../store/slice/boardSlice";
import type { RootState } from "../../../../store/store";
import { useSelector } from "react-redux";

function BoardPage() {
  const dispatcher = useDispatch<AppDispatch>();

  React.useEffect(() => {
    dispatcher(getBoardData())
  }, []);

  const loading = useSelector((state: RootState) => state.board.loading);
  const error = useSelector((state: RootState) => state.board.error);
  const boardData = useSelector((state: RootState) => state.board.boards);

  return (
    <div>
      <div className="flex items-center justify-between">
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
            <p className="text-center text-red-500">{error}</p>
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
