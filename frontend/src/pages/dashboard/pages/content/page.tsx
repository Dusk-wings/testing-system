import React from "react";
import { useParams } from "react-router";
import {
  type BoardInformation,
  type ListInformation,
  type CardInformation
} from "./types";


function BoardContentPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState<string | null>(null);
  const [boardData, setBoardData] = React.useState<BoardInformation | null>(
    null,
  );

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
    <div className="p-4 w-full h-dvh overflow-y-hidden flex items-start gap-4 justify-start">
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="italic text-sm text-center">Loading ....</p>
        </div>
      ) : isError ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="italic text-sm text-center">{isError}</p>
        </div>
      ) : (
        <section aria-label="Content">
          <h1 className="text-2xl font-bold">{boardData?.title}</h1>
          <section aria-label="Board Content">
            {boardData?.lists.map((list: ListInformation) => {
              return (
                <div key={list._id}>
                  <h2 className="text-xl font-bold">{list.title}</h2>
                  <section aria-label="List Content">
                    {list.cards.map((card: CardInformation) => {
                      return (
                        <div key={card._id}>
                          <h3 className="text-lg font-bold">{card.title}</h3>
                          <p className="text-sm">{card.description}</p>
                        </div>
                      );
                    })}
                  </section>
                </div>
              );
            })}
          </section>
        </section>
      )}
    </div>
  );
}

export default BoardContentPage;
