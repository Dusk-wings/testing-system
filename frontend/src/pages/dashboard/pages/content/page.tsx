import React from "react";
import { useParams } from "react-router";
import ListComponent from "../../../../components/ui/list";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../../store/store";
import { setOpen } from "../../../../store/slice/hoverWindowSlice";
import Button from "../../../../components/ui/button";
import { Plus, Settings } from "lucide-react";
import { fetchCurrentData, type ListInterface } from "../../../../store/slice/currentData";


function BoardContentPage() {
  const params = useParams();
  const boardData = useSelector((state: RootState) => state.currentData)

  const dispatcher = useDispatch<AppDispatch>();

  // const fetchBoardData = React.useCallback(async () => {
  //   setIsLoading(true);
  //   try {
  //     const SERVER_PATH = import.meta.env.VITE_BACKEND_PATH;
  //     const response = await fetch(`${SERVER_PATH}/api/boards/${params.id}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       console.log(data.data)
  //       setBoardData(data.data);
  //     } else {
  //       setIsError(data.message);
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(error);
  //     setIsError(
  //       "Network Error, please try to connect to internet or wait for a while",
  //     );
  //     setIsLoading(false);
  //   }
  // }, [params.id]);


  React.useEffect(() => {
    dispatcher(fetchCurrentData({ id: params.id! }));
  }, []);

  return (
    <div className="p-4 w-full h-dvh overflow-y-hidden flex items-start gap-4 justify-start w-full">
      {boardData.isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="italic text-sm text-center">Loading ....</p>
        </div>
      ) : boardData.isError ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="italic text-sm text-center">{boardData.isError}</p>
        </div>
      ) : (
        <section aria-label="Content" className="w-full overflow-hidden">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold">{boardData.board?.title}</h1>
            <Button onClick={() => {
              dispatcher(setOpen({
                heading: "Create List",
                headingDescription: `Create a new list in ${boardData.board?.title}`,
                open: true,
                type: "LIST_CREATION",
                data: {
                  board_id: boardData.board?._id,
                  position: (boardData.board?.lists.length ?? 0) + 1
                }
              }))
            }}>
              <Plus />
            </Button>
          </div>
          <section aria-label="Board Content" className="mt-4 w-full overflow-x-auto flex gap-2 flex-nowrap h-full ">
            {boardData.board?.lists.length === 0 ? (
              <p className="text-sm text-center">
                No lists, start by creating a list
              </p>
            ) : [...(boardData.board?.lists ?? [])].sort((a, b) => a.position - b.position).map((list: ListInterface) => {
              return (
                <ListComponent
                  key={list._id}
                  title={list.title}
                  cards={list.cards ?? []}
                  operation={() => {
                    dispatcher(setOpen({
                      heading: "Create Card",
                      headingDescription: `Create a new card in ${list.title}`,
                      open: true,
                      type: 'CARD_CREATION',
                      data: {
                        list_id: list._id,
                        board_id: boardData.board?._id,
                      }
                    }))
                  }}
                  position={list.position}
                  totalLists={boardData.board?.lists.length ?? 0}
                  list_id={list._id}
                  board_id={boardData.board?._id}
                />
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
              id: boardData.board?._id,
            }
          }))
        }} className="fixed bottom-4 right-4">
        <Settings />
      </Button>
    </div>
  );
}

export default BoardContentPage;
