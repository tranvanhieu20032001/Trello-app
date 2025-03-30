import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useWorkspace } from "~/context/WorkspaceContext";
import AddNewMember from "../Modal/AddNewMember";
import { updateWorkspaceName } from "~/apis";
import { toast } from "react-toastify";

const HeaderWorkspaceContent = () => {
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const { workspaceData, workspaceName, setWorkspaceName } = useWorkspace();

  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState(workspaceName);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const handleSave = async () => {
    if (!tempName.trim()) return;
    try {
      const data = { workspaceId: id, userId: user.id, newName: tempName };
      const response = await updateWorkspaceName(data);
      setWorkspaceName(tempName);
      setEditName(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update workspace name. Please try again.");
    }
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 p-2">
        <div className="w-10 h-10 flex justify-center items-center bg-green-600 text-white rounded-md font-semibold text-lg">
          {workspaceName.slice(0, 1).toUpperCase()}
        </div>

        {!editName ? (
          <>
            <span className="font-semibold">{workspaceName}</span>
            {user?.id === workspaceData?.ownerId && (
              <button
                className="p-1.5 hover:bg-gray-200 rounded-sm"
                onClick={() => setEditName(true)}
              >
                <CiEdit size={18} />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2">
            <input
              className="border outline-none px-2 py-1 text-sm"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <button
              className="text-xs gap-2 font-medium flex items-center px-2 py-1.5 bg-blue-600 text-white hover:bg-primary border border-blue-700 rounded-sm"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="p-1.5 text-xs bg-gray-300 text-primary rounded-sm hover:bg-gray-400 font-medium border border-blue-300"
              onClick={() => setEditName(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button
        className="text-[13px] gap-2 font-medium flex items-center px-2 py-1.5 bg-blue-600 text-white hover:bg-primary border border-blue-700 rounded-sm"
        onClick={() => setIsInviteOpen(true)}
      >
        <FaUserPlus size={15} />
        Invite Workspace Members
      </button>

      <AddNewMember
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspaceId={id}
      />
    </div>
  );
};

export default HeaderWorkspaceContent;
