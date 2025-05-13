import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  closeBoard_API,
  deleteBoard_API,
  getBoardByRecent_API,
  getBoardByStarred_API,
  inviteMemberBoard_API,
  leaveBoard,
  removeUserboard,
  reOpenBoard_API,
  toggleStarred_API,
  updateCardOrderDifferentColumn_API,
  updateCardOrderInColumn_API,
  updateColumnOrder_API,
} from "~/apis";
import { fetchBoardById } from "~/store/slices/boardSlice";
import { startLoading, stopLoading } from "~/store/slices/loadingSlice";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";

export const useBoardActions = () => {
  const dispatch = useDispatch();

  const handleCopyLink = useCallback(async (id) => {
    if (!id) return toast.error("Invalid workspace ID");

    try {
      const response = await inviteMemberBoard_API(id);
      if (response?.data?.link) {
        navigator.clipboard.writeText(response.data.link);
        toast.success("Invite link copied!");
      } else {
        toast.error("Failed to generate invite link!");
      }
    } catch (error) {
      toast.error("Error generating invite link.");
    }
  }, []);

  const handlGetBoardByRecent = useCallback(async () => {
    try {
      const response = await getBoardByRecent_API();
      return response.data;
    } catch (error) {
      toast.error("Failed to board");
    }
  }, []);

    const handlGetBoardByStarred = useCallback(async () => {
    try {
      const response = await getBoardByStarred_API();
      return response.data;
    } catch (error) {
      toast.error("Failed to board");
    }
  }, []);

  const handleCloseBoard = useCallback(
    async (boardId, workspaceId) => {
      if (!boardId) return toast.error("Invalid board ID");

      dispatch(startLoading());

      try {
        const response = await closeBoard_API(boardId);
        dispatch(fetchWorkspaceData(workspaceId));
        dispatch(fetchBoardById(boardId));

        toast.success(response.data.message);
      } catch (error) {
        toast.error("Failed to close board");
      } finally {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
      }
    },
    [dispatch]
  );

  const handleReOpenBoard = useCallback(
    async (boardId, workspaceId) => {
      if (!boardId) return toast.error("Invalid board ID");

      dispatch(startLoading());

      try {
        const response = await reOpenBoard_API(boardId);
        dispatch(fetchWorkspaceData(workspaceId));
        dispatch(fetchBoardById(boardId));

        toast.success(response.data.message);
      } catch (error) {
        toast.error("Failed to reopen board");
      } finally {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
      }
    },
    [dispatch]
  );

  const handleDeleteBoard = useCallback(
    async (boardId, workspaceId) => {
      if (!boardId) return toast.error("Invalid board ID");

      dispatch(startLoading());

      try {
        const response = await deleteBoard_API(boardId);
        dispatch(fetchWorkspaceData(workspaceId));
        dispatch(fetchBoardById(boardId));
        toast.success(response.data.message);
      } catch (error) {
        toast.error("Failed to reopen board");
      } finally {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
      }
    },
    [dispatch]
  );

  const handleToggleStarred = useCallback(
    async (boardId) => {
      if (!boardId) return toast.error("Invalid board ID");

      try {
        const response = await toggleStarred_API(boardId);
        dispatch(fetchBoardById(boardId));
      } catch (error) {
        toast.error("Failed to handle board");
      }
    },
    [dispatch]
  );
  

  const getBoardsWithUserStarred = (boards, userId) => {
    return boards.map((board) => {
      const userPreference = board.UserBoardPreference?.find(
        (pref) => pref.userId === userId
      );
      return {
        ...board,
        starred: userPreference ? userPreference.starred : false,
      };
    });
  };
  const handleLeaveBoard = useCallback(
    async (id) => {
      if (!id) return toast.error("Invalid board ID");

      try {
        dispatch(startLoading());
        const response = await leaveBoard(id);
      } catch (error) {
        toast.error("Failed to leave workspace.");
      } finally {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
      }
    },
    [dispatch]
  );

  const handleRemoveMemberFromBoard = useCallback(
    async (boardId, ownerId, userId) => {
      if (!boardId || !ownerId || !userId) return toast.error("Invalid data");
      try {
        dispatch(startLoading());
        const response = await removeUserboard(boardId, { ownerId, userId });
      } catch (error) {
        toast.error("Failed to remove user.");
      } finally {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
      }
    },
    [dispatch]
  );

  const handleMoveColumn = useCallback(
    async (boardId, orderColums) => {
      const orderColumnIds = orderColums.map((column) => column.id);
      if (!boardId || orderColumnIds.length === 0) {
        toast.error("Invalid column data");
        return;
      }
      try {
        await updateColumnOrder_API(boardId, {
          columnOrderIds: orderColumnIds,
        });
      } catch (error) {
        toast.error("Failed to update column order");
        console.error(error);
      }
    },
    [dispatch]
  );

  const handleMoveCardInColumnn = useCallback(
    async (columnId, cardOrderIds) => {
      try {
        await updateCardOrderInColumn_API(columnId, { cardOrderIds });
      } catch (error) {
        toast.error("Failed to update card order");
        console.error(error);
      }
    },
    [dispatch]
  );

  const handleMoveCardToDifferentColumnn = useCallback(
    async (activeCardId, oldColumnId, newColumnId, columnData) => {
      const cardOrderIdsNewColumn = columnData.find(
        (column) => column.id === newColumnId
      ).cardOrderIds;
      const cardOrderIdsOldColumn = columnData.find(
        (column) => column.id === oldColumnId
      ).cardOrderIds;
      const data = {
        activeCardId,
        oldColumnId,
        newColumnId,
        cardOrderIdsOldColumn,
        cardOrderIdsNewColumn,
      };
      await updateCardOrderDifferentColumn_API(data);
    },
    [dispatch]
  );

  return {
    handleCopyLink,
    handleCloseBoard,
    handlGetBoardByRecent,
    handlGetBoardByStarred,
    handleReOpenBoard,
    handleDeleteBoard,
    handleToggleStarred,
    getBoardsWithUserStarred,
    handleRemoveMemberFromBoard,
    handleLeaveBoard,
    handleMoveColumn,
    handleMoveCardInColumnn,
    handleMoveCardToDifferentColumnn,
  };
};
