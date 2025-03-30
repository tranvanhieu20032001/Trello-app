import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { closeBoard_API, reOpenBoard_API, toggleStarred_API } from "~/apis";
import { useWorkspace } from "~/context/WorkspaceContext";
import { fetchBoardById } from "~/store/slices/boardSlice";
import { startLoading, stopLoading } from "~/store/slices/loadingSlice";

export const useBoardActions = () => {
  const { fetchWorkspaceData } = useWorkspace();
  const dispatch = useDispatch();

  const handleCloseBoard = useCallback(
    async (boardId, workspaceId) => {
      if (!boardId) return toast.error("Invalid board ID");

      dispatch(startLoading());

      try {
        const response = await closeBoard_API(boardId);
        await fetchWorkspaceData(workspaceId);
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
    [dispatch, fetchWorkspaceData]
  );

  const handleReOpenBoard = useCallback(
    async (boardId, workspaceId) => {
      if (!boardId) return toast.error("Invalid board ID");

      dispatch(startLoading());

      try {
        const response = await reOpenBoard_API(boardId);
        await fetchWorkspaceData(workspaceId);
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
    [dispatch, fetchWorkspaceData]
  );

  const handleToggleStarred = useCallback(
    async (boardId, workspaceId) => {
      if (!boardId) return toast.error("Invalid board ID");
      try {
        const response = await toggleStarred_API(boardId);
        await fetchWorkspaceData(workspaceId);
        dispatch(fetchBoardById(boardId));

        toast.success(response.data.message);
      } catch (error) {
        toast.error("Failed to handle board");
      }
    },
    [dispatch, fetchWorkspaceData]
  );

  const getBoardsWithUserStarred = (boards, userId) => {
    return boards.map((board) => {
      const userPreference = board.UserBoardPreference?.find(
        (pref) => pref.userId === userId
      );
      return {
        ...board,
        starred: userPreference ? userPreference.starred : false, // Nếu không có thì mặc định là false
      };
    });
  };
  

  return { handleCloseBoard, handleReOpenBoard, handleToggleStarred, getBoardsWithUserStarred };
};
