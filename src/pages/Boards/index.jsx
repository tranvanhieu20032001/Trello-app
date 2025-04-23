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

  useEffect(() => {
    if (!boardId) return;

    socket.emit("joinBoard", boardId);

    const handleNewMember = (username) => {
      toast.success(`${username} has been added to the board!`);
      dispatch(fetchBoardById(boardId));
    };

    const handleRemoveMember = (username) => {
      toast.success(`${username} has been removed from the board.`);
      dispatch(fetchBoardById(boardId));
    };

    const handleLeaveMember = (username) => {
      toast.success(`${username} has left the board.`);
      dispatch(fetchBoardById(boardId));
    };

    socket.on("new-member", handleNewMember);
    socket.on("remove-member", handleRemoveMember);
    socket.on("leave-member", handleLeaveMember);

    return () => {
      socket.off("new-member", handleNewMember);
      socket.off("remove-member", handleRemoveMember);
      socket.off("leave-member", handleLeaveMember);
    };
  }, [boardId]);

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

  const backgroundImage = board?.background
    ? `url('${board.background}')`
    : "none";

  return (
    <div
      className="bg-cover h-screen max-h-screen block overflow-y-hidden"
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
