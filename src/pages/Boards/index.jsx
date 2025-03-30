import { useParams } from "react-router-dom";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";
import { useWorkspace } from "~/context/WorkspaceContext";

function Board() {
  const { boardId } = useParams();

  const dispatch = useDispatch();
  const { fetchWorkspaceData } = useWorkspace();
  const { board } = useSelector((state) => state.board);

  console.log("boardsdasdas", board);

  useEffect(() => {
    fetchWorkspaceData(board?.data.workspaceId);
  }, [board?.data.workspaceId, fetchWorkspaceData]);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoardById(boardId));
    }
    return () => {
      dispatch(clearBoard());
    };
  }, [boardId, dispatch]);

  const backgroundImage = board?.data?.background
    ? `url('${board.data.background}')`
    : "none";

  return (
    <div
      className="bg-cover h-screen max-h-screen block overflow-y-hidden"
      style={{ backgroundImage }}
    >
      <div className="bg-black bg-opacity-5 h-full dark:bg-opacity-50">
        {board && (
          <>
            <BoardBar board={board.data} />
            {board?.data?.status && <BoardContent board={board.data} />}
          </>
        )}
      </div>
    </div>
  );
}

export default Board;
