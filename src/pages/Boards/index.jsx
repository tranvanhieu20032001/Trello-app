import { useParams } from "react-router-dom";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";
import NofoundPage from "~/components/Workspace/Content/NofoundPage";

function Board() {
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const boardState = useSelector((state) => state.board);
  const board = boardState?.board?.data;
  const visibility = board?.type;
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  const user = useSelector((state) => state.auth.user);
  console.log("board", board);
  

  useEffect(() => {
    if (boardId) dispatch(fetchBoardById(boardId));

    return () => {
      dispatch(clearBoard());
    };
  }, [boardId, dispatch]);

  useEffect(() => {
    if (board?.workspaceId) {
      dispatch(fetchWorkspaceData(board.workspaceId));
    }
  }, [board?.workspaceId, dispatch]);

  const isMemberWorkspace = useMemo(
    () => workspaceData?.members?.some((m) => m.userId === user?.id),
    [workspaceData, user]
  );

  const isMemberBoard = useMemo(
    () => board?.BoardMembers?.some((m) => m.userId === user?.id),
    [board, user]
  );

  const permissionAccess =
    visibility === "public" ||
    (visibility === "private" && isMemberBoard) ||
    (visibility === "workspace" && isMemberWorkspace);


  console.log("permissionAccess", permissionAccess);
  console.log("visibility", visibility);
  
  const backgroundImage = board?.background
    ? `url('${board.background}')`
    : "none";

  return (
    <div
      className="bg-cover h-screen max-h-screen block overflow-y-hidden"
      style={{ backgroundImage }}
    >
      <div className="bg-black bg-opacity-5 h-full dark:bg-opacity-50">
        {board && (
          <>
            {permissionAccess? (
              <>
                <BoardBar board={board} />
                <BoardContent board={board} />
              </>
            ) : (
              <NofoundPage />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Board;
