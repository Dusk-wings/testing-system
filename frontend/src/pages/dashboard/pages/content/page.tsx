import React from "react";
import { useParams } from "react-router";
import type { Board, Card, List } from '../../../../lib/types/board'
import ListComponent from "../../../../components/ui/list";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../../store/store";
import { setOpen } from "../../../../store/slice/hoverWindowSlice";
import Button from "../../../../components/ui/button";
import { Plus, Settings } from "lucide-react";


interface ListInformation extends List {
  cards: Card[];
}

interface BoardInformation extends Board {
  lists: ListInformation[];
}

function BoardContentPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<string | null>(null);
  const [boardData, setBoardData] = React.useState<BoardInformation | null>(
    null,
  );

  const dispatcher = useDispatch<AppDispatch>();

  const fetchBoardData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
      const response = await fetch(`${SERVER_PATH}/api/boards/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setBoardData(data.data);
      } else {
        setIsError(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsError(
        "Network Error, please try to connect to internet or wait for a while",
      );
      setIsLoading(false);
    }
  }, [params.id]);

  React.useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  return (
    <div className="p-4 w-full h-dvh overflow-y-hidden flex items-start gap-4 justify-start w-full">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="italic text-sm text-center">Loading ....</p>
        </div>
      ) : isError ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="italic text-sm text-center">{isError}</p>
        </div>
      ) : (
        <section aria-label="Content" className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{boardData?.title}</h1>
            <Button onClick={() => {
              dispatcher(setOpen({
                heading: "Create List",
                headingDescription: `Create a new list in ${boardData?.title}`,
                open: true,
                type: "LIST_CREATION",
                data: {
                  board_id: boardData?._id,
                  position: (boardData?.lists.length ?? 0) + 1
                }
              }))
            }}>
              <Plus />
            </Button>
          </div>
          <section aria-label="Board Content" className="mt-4 w-full">
            {boardData?.lists.length === 0 ? (
              <p className="text-sm text-center">
                No lists, start by creating a list
              </p>
            ) : boardData?.lists.map((list: ListInformation) => {
              return (
                <div key={list._id}>
                  <ListComponent
                    title={list.title}
                    cards={list.cards}
                    operation={() => {
                      dispatcher(setOpen({
                        heading: "Create Card",
                        headingDescription: `Create a new card in ${list.title}`,
                        open: true,
                        type: 'CARD_CREATION',
                        data: {
                          list_id: list._id,
                          board_id: boardData?._id,
                          position: list.cards.length + 1
                        }
                      }))
                    }}
                  />
                </div>
              );
            })}
          </section>
        </section>
      )}
      <Button
        variant="secondary"
        onClick={() => {
          dispatcher(setOpen({
            heading: "Update Board",
            headingDescription: "Update settings for this board",
            open: true,
            type: "BOARD_UPDATION",
            data: {
              board_id: boardData?._id,
            }
          }))
        }} className="fixed bottom-4 right-4">
        <Settings />
      </Button>
    </div>
  );
}

export default BoardContentPage;
