import React, { useEffect, useState, useCallback } from "react";
import { CiEdit } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa6";
import { BiLink } from "react-icons/bi";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useWorkspace } from "~/context/WorkspaceContext";
import nofund from "~/assets/nofund.svg";
import {
  getWorkspaceById_API,
  inviteMemberWorkspace_API,
  leaveWorkspace,
  removeUserWorkspace,
  updateWorkspaceName,
} from "~/apis";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AddNewMember from "../Modal/AddNewMember";
import { LiaTimesSolid } from "react-icons/lia";
import useSocket from "~/utils/useSocket";

const MemberContent = () => {
  const user = useSelector((state) => state.auth.user);
  const { workspaceName, setWorkspaceName } = useWorkspace();
  const { id } = useParams();
  const [editName, setEditName] = useState(false);
  const [tempName, setTempName] = useState(workspaceName);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [query, setQuery] = useState("");

  useSocket(id);

  const filteredMembers = workspaceData?.members?.filter((member) =>
    member.user.username.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await getWorkspaceById_API(id);
        setWorkspaceData(response.data.data);
        setWorkspaceName(response.data.data.name);
        setTempName(response.data.data.name);
        // console.log("data", response.data.data);
      } catch (error) {
        toast.error("Failed to fetch workspace data.");
      }
    };

    if (id) fetchWorkspace();
  }, [id, setWorkspaceName]);

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

  const handleCopyLink = useCallback(async () => {
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
      // console.error("Error generating invite link", error);
    }
  }, [id]);

  return (
    <div className="max-w-screen-lg mx-auto my-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 p-2">
          <div className="w-10 h-10 flex justify-center items-center bg-green-600 text-white rounded-md font-semibold text-lg">
            {workspaceName.slice(0, 2).toUpperCase()}
          </div>

          {!editName ? (
            <>
              <span className="font-semibold">{workspaceName}</span>
              {user?.id === workspaceData?.ownerId ? (
                <button
                  className="p-1.5 hover:bg-gray-200 rounded-sm"
                  onClick={() => setEditName(true)}
                >
                  <CiEdit size={18} />
                </button>
              ) : (
                ""
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
                className="p-1.5 text-xs bg-blue-500 text-white rounded-sm hover:bg-primary"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="p-1.5 text-xs bg-gray-300 text-primary rounded-sm hover:bg-gray-400"
                onClick={() => setEditName(false)}
              >
                Cancle
              </button>
            </div>
          )}
        </div>

        <button
          className="text-[13px] gap-2 font-medium flex items-center px-2 py-1.5 bg-blue-500 text-white hover:bg-primary rounded-sm"
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

      <hr className="my-4" />

      {/* Invite Link Section */}
      <h1 className="font-semibold mb-2">Invite members to join you</h1>
      <div className="flex items-center mt-2 text-sm gap-10">
        <span>Invite someone to this Workspace with a link:</span>
        <button
          className="flex items-center px-4 py-1 bg-gray-300 rounded-sm hover:text-blue-500"
          onClick={handleCopyLink}
        >
          <BiLink size={15} /> Copy link
        </button>
      </div>

      <hr className="my-4" />
      {/* Members Section */}
      <h1 className="font-semibold mb-2">
        Workspace member ({workspaceData?.members?.length})
      </h1>
      <p className="text-sm">
        Workspace members can view and join all Workspace visible boards and
        create new boards in the Workspace.
      </p>

      <hr className="my-4" />

      {/* Members List */}
      <input
        className="w-60 border border-gray-500 text-sm px-2 py-1 rounded-sm focus:outline-none focus:border-blue-500"
        type="text"
        placeholder="Filter by name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="search-result mt-4 max-h-[30rem] overflow-auto px-2">
        {filteredMembers?.length > 0 ? (
          filteredMembers.map((member, index) => (
            <MemberItem
              key={index}
              member={member.user}
              ownerId={workspaceData.ownerId}
              setWorkspaceData={setWorkspaceData}
            />
          ))
        ) : (
          <div className="text-gray-500 text-center py-10">
            <img className="w-20 mx-auto" src={nofund} alt="" />
            <p>
              Uh oh, there is no one here by that name. Should there be? Invite
              them now!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Member Item Component
const MemberItem = ({ member, ownerId, setWorkspaceData }) => {
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  // console.log("user", user.id);
  const handleLeaveWorkspace = async (workspaceId) => {
    try {
      const response = await leaveWorkspace(workspaceId);
      toast.success(response.data.message);
      const updatedResponse = await getWorkspaceById_API(workspaceId);
      setWorkspaceData(updatedResponse.data.data);
    } catch (error) {
      toast.error("Failed to leave workspace.");
    }
  };

  const handleRemoveWorkspace = async (workspaceId, memberId) => {
    try {
      const response = await removeUserWorkspace(workspaceId, {
        ownerId,
        userId: memberId,
      });
      toast.success(response.data.message);
      const updatedResponse = await getWorkspaceById_API(workspaceId);
      setWorkspaceData(updatedResponse.data.data);
    } catch (error) {
      toast.error("Failed to remove user.");
      console.error("Lỗi khi xóa workspace:", error);
    }
  };

  return (
    <>
      <div className="member-search flex items-center gap-3">
        {member?.avatar ? (
          <img className="w-7 h-7 rounded-full" src={member?.avatar} alt="" />
        ) : (
          <div className="min-w-7 h-7 rounded-full flex items-center justify-center text-xs bg-blue-500 text-white">
            {member?.username.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-medium">{member?.username}</h3>
          <span className="text-sm">{member?.email}</span>
        </div>
        <div className="details-board flex gap-4 items-center justify-end w-full">
          <button className="text-sm bg-slate-300 px-2 py-1 rounded-sm">
            View boards
            {member?.boards?.length > 0 && (
              <span>({member.boards.length})</span>
            )}
          </button>
          <button className="text-sm bg-slate-300 px-2 py-1 rounded-sm flex items-center gap-1">
            <AiOutlineUserSwitch />
            {member?.id === ownerId ? "Admin" : "Member"}
          </button>
          {member?.id === user?.id ? (
            <button
              onClick={() => handleLeaveWorkspace(id)}
              className="text-sm bg-slate-300 px-2 py-1 rounded-sm flex items-center gap-1"
            >
              Leave <IoIosLogOut />
            </button>
          ) : user?.id === ownerId ? (
            <button
              onClick={() => handleRemoveWorkspace(id, member?.id)}
              className="text-sm bg-slate-300 px-2 py-1 rounded-sm flex items-center gap-1"
            >
              Remove <LiaTimesSolid />
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      <hr className="my-2" />
    </>
  );
};

export default MemberContent;
