import { useParams } from "react-router-dom";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";
import NofoundPage from "~/components/Workspace/Content/NofoundPage";
import { cloneDeep, isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";
import { toast } from "react-toastify";
import socket from "~/utils/socket";

function Board() {
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const boardData = useSelector((state) => state.board);
  const board = boardData?.board?.data;
  const visibility = board?.type;
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  const user = useSelector((state) => state.auth.user);

  const [localBoard, setLocalBoard] = useState(null);

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

  useEffect(() => {
    if (board) {
      const clonedBoard = cloneDeep(board);
      clonedBoard.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          const placeholder = generatePlaceholderCard(column);
          column.cards = [placeholder];
          column.cardsOrderIds = [placeholder.id];
        }
      });
      setLocalBoard(clonedBoard);
    }
  }, [board]);


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
    (visibility === "workspace" && isMemberWorkspace) ||
    (visibility === "workspace" && isMemberBoard);

  const backgroundImage = board?.background
    ? `url('${board.background}')`
    : "none";

  return (
    <div
      className="bg-cover h-screen max-h-screen block overflow-y-hidden w-full"
      style={{ backgroundImage }}
    >
      <div className="bg-black bg-opacity-5 h-full dark:bg-opacity-50">
        {localBoard && (
          <>
            {permissionAccess ? (
              <>
                <BoardBar board={localBoard} />
                <BoardContent board={localBoard} />
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
