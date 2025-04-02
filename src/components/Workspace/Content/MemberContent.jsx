import { useState } from "react";
import { BiLink } from "react-icons/bi";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { useParams } from "react-router-dom";
// import { useWorkspace } from "~/context/WorkspaceContext";
import nofund from "~/assets/nofund.svg";
import { useSelector } from "react-redux";
import { LiaTimesSolid } from "react-icons/lia";
import HeaderWorkspaceContent from "../Header/HeaderWorkspaceContent";
import ConfirmAction from "../../Modal/ConfirmAction";
import { useWorkspaceActions } from "~/utils/hooks/useWorkspaceActions";

const MemberContent = () => {
  const { handleCopyLink } = useWorkspaceActions();
  const { id } = useParams();
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  const [query, setQuery] = useState("");

  const filteredMembers = workspaceData?.members?.filter((member) =>
    member.user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="py-8 px-20">
      <HeaderWorkspaceContent />

      <hr className="my-4" />

      {/* Invite Link Section */}
      <h1 className="font-semibold mb-2">Invite members to join you</h1>
      <div className="flex items-center mt-2 text-sm gap-10">
        <span>Invite someone to this Workspace with a link:</span>
        <button
          className="flex items-center px-4 py-1 bg-gray-300 dark:bg-white rounded-sm hover:text-blue-500 border border-blue-300"
          onClick={() => handleCopyLink(id)}
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
      <div className="search-result mt-4 max-h-[30rem] px-2 relative">
        {filteredMembers?.length > 0 ? (
          filteredMembers.map((member, index) => (
            <MemberItem
              key={index}
              member={member.user}
              ownerId={workspaceData.ownerId}
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

const MemberItem = ({ member, ownerId }) => {
  const user = useSelector((state) => state.auth.user);
  const { id } = useParams();
  const { handleLeaveWorkspace, handleRemoveWorkspace } = useWorkspaceActions();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  console.log("member", member);
  

  return (
    <>
      <div className="member-search flex items-center gap-3 relative">
        {member?.avatar ? (
          <img className="w-7 h-7 rounded-full" src={member?.avatar} alt="" />
        ) : (
          <div className="min-w-7 h-7 rounded-full flex items-center justify-center text-xs bg-blue-600 text-white">
            {member?.username.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-medium flex gap-4 items-center">
            {member?.username}
            <span className={`flex text-[10px] gap-1 items-center px-1 py-0.5 rounded-md ${member?.id === ownerId ? "bg-red-200 text-red-800" : "bg-blue-200 text-blue-800"}`}>
              {member?.id === ownerId ? "Admin" : "Member"}
            </span>
          </h3>
          <span className="text-sm">{member?.email}</span>
        </div>
        <div className="details-board flex gap-4 items-center justify-end w-full">
          <button className="text-sm bg-blue-600 text-white hover:bg-primary border border-blue-700 px-2 py-1 rounded-sm">
            View boards
            {member?.boards?.length > 0 && (
              <span>({member.boards.length})</span>
            )}
          </button>
          {member?.id === user?.id ? (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="text-sm bg-red-500 text-white hover:bg-red-600 border border-red-700 px-2 py-1 rounded-sm flex items-center gap-1"
            >
              Leave <IoIosLogOut />
            </button>
          ) : user?.id === ownerId ? (
            <button
              onClick={() => {
                setSelectedMemberId(member?.id);
                setIsRemoveModalOpen(true);
              }}
              className="text-sm bg-red-500 text-white hover:bg-red-600 border border-red-700 px-2 py-1 rounded-sm flex items-center gap-1"
            >
              Remove <LiaTimesSolid />
            </button>
          ) : null}
        </div>
        <ConfirmAction
          isOpen={isLeaveModalOpen}
          onClose={(e) => {
            setIsLeaveModalOpen(false);
            e.preventDefault();
            e.stopPropagation();
          }}
          onConfirm={() => handleLeaveWorkspace(id)}
          title="Leave Workspace"
          message="Are you sure you want to leave this workspace?"
        />

        <ConfirmAction
          isOpen={isRemoveModalOpen}
          onClose={(e) => {
            setIsRemoveModalOpen(false);
            e.preventDefault();
            e.stopPropagation();
          }}
          onConfirm={() => handleRemoveWorkspace(id, ownerId, selectedMemberId)}
          title="Remove Member"
          message="Are you sure you want to remove this member?"
        />
      </div>
      <hr className="my-2" />
    </>
  );
};

export default MemberContent;
