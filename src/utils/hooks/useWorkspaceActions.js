import { useCallback } from "react";
import { toast } from "react-toastify";
import {
  inviteMemberWorkspace_API,
  leaveWorkspace,
  removeUserWorkspace,
} from "~/apis";
import { useWorkspace } from "~/context/WorkspaceContext";

export const useWorkspaceActions = () => {
  const { fetchWorkspaceData } = useWorkspace();
  const handleCopyLink = useCallback(async (id) => {
    if (!id) return toast.error("Invalid workspace ID");

    try {
      const response = await inviteMemberWorkspace_API(id);
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

  const handleLeaveWorkspace = useCallback(
    async (id) => {
      if (!id) return toast.error("Invalid workspace ID");

      try {
        const response = await leaveWorkspace(id);
        toast.success(response.data.message);
        await fetchWorkspaceData(id);
      } catch (error) {
        toast.error("Failed to leave workspace.");
      }
    },
    [fetchWorkspaceData]
  );

  const handleRemoveWorkspace = useCallback(
    async (id, ownerId, userId) => {
      if (!id || !ownerId || !userId) return toast.error("Invalid data");
      try {
        const response = await removeUserWorkspace(id, { ownerId, userId });
        toast.success(response.data.message);
        await fetchWorkspaceData(id);
      } catch (error) {
        toast.error("Failed to remove user.");
      }
    },
    [fetchWorkspaceData]
  );

  return { handleCopyLink, handleLeaveWorkspace, handleRemoveWorkspace };
};
