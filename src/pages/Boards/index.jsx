import { useParams } from "react-router-dom";
import BoardBar from "./BoardBar";
import BoardContent from "./BoardContent";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBoard, fetchBoardById } from "~/store/slices/boardSlice";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";
import NofoundPage from "~/components/Workspace/Content/NofoundPage";
import { cloneDeep } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatters";

function Board() {
  const { boardId } = useParams();
  const dispatch = useDispatch();

  const boardData = useSelector((state) => state.board);
  const board = boardData?.board?.data;
  const visibility = board?.type;
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  const user = useSelector((state) => state.auth.user);
  const filters = useSelector((state) => state.filter);
  console.log("filters", filters);

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
    if (!board) return;

    const clonedBoard = cloneDeep(board);
    clonedBoard.columns.forEach((column) => {
      let filteredCards = column.cards;

      console.log("filteredCards", filteredCards);

      if (filters.members.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          card?.CardMembers?.some((m) => filters.members.includes(m.userId))
        );
      }

      // ✅ Lọc theo labels (filter theo label.id)
      if (filters.labels.length > 0) {
        filteredCards = filteredCards.filter((card) =>
          card.labels?.some((label) => filters.labels.includes(label.labelId))
        );
      }

      if (filters.status !== null && filters.status !== undefined) {
        filteredCards = filteredCards.filter(
          (card) => card?.isComplete === filters.status
        );
      }

      if (filters.dueDate.length > 0) {
        const now = new Date();

        filteredCards = filteredCards.filter((card) => {
          const due = card?.dueDate ? new Date(card.dueDate) : null;

          const isOverdue =
            filters.dueDate.includes("Overdue") &&
            due &&
            due < now &&
            !card?.isCompleted;

          const isNoDueDate =
            filters.dueDate.includes("No dates") && !card?.dueDate;

          return isOverdue || isNoDueDate;
        });
      }

      // Nếu rỗng, thêm placeholder
      if (filteredCards.length === 0) {
        const placeholder = generatePlaceholderCard(column);
        column.cards = [placeholder];
        column.cardsOrderIds = [placeholder.id];
      } else {
        column.cards = filteredCards;
        column.cardsOrderIds = filteredCards.map((card) => card.id);
      }
    });

    setLocalBoard(clonedBoard);
  }, [board, filters]);

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
      className="bg-cover block overflow-y-hidden w-full"
      style={{ backgroundImage }}
    >
      <div className="bg-black bg-opacity-5 dark:bg-opacity-50">
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
