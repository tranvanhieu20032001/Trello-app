import { useState } from "react";
import { BsBookmarkStarFill } from "react-icons/bs";
import { FaGoogleDrive, FaRegStar, FaStar } from "react-icons/fa6";
import { IoIosFlash } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdFilterList } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import ConfirmAction from "~/components/Modal/ConfirmAction";
import InviteMemberToBoard from "~/components/Modal/InviteMemberToBoard";
import { data } from "~/data/data";
import { useBoardActions } from "~/utils/hooks/useBoardActions";
import Visibility from "./sections/Visibility";
import { PiWarningCircleLight } from "react-icons/pi";
import TitleBoard from "./sections/TitleBoard";
import Starred from "./sections/Starred";

function BoardBar({ board }) {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { handleReOpenBoard } = useBoardActions();

  console.log("board", board?.BoardMembers);

  return (
    <div
      id="boardbar"
      className="h-14 text-white dark:text-secondary bg-white bg-opacity-15 px-4 py-2 flex justify-between text-xs md:text-sm flex-col lg:flex-row"
    >
      <div className="flex items-center gap-4 justify-between lg:justify-start">
        <TitleBoard data={board} />
        <Starred data={board} />
        {board.status && (
          <>
            <span
              id="gg-drive"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1"
            >
              <FaGoogleDrive size={20} />{" "}
              <span className="hidden lg:inline-block">
                Add to Google Drive
              </span>
            </span>
            <Tooltip
              anchorSelect="#gg-drive"
              clickable
              className="z-10"
              place="bottom"
            >
              Add to Google Drive
            </Tooltip>
            <span
              id="automation"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1"
            >
              <IoIosFlash size={20} />{" "}
              <span className="hidden lg:inline-block">Automation</span>
            </span>
            <Tooltip
              anchorSelect="#automation"
              clickable
              className="z-10"
              place="bottom"
            >
              Automation
            </Tooltip>

            <span
              id="filter"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1"
            >
              <MdFilterList size={20} />
              <span className="hidden lg:inline-block">Filter</span>
            </span>
            <Tooltip anchorSelect="#filter" className="z-10" place="bottom">
              Filter <span className="px-2 py-1 bg-slate-600">F</span>
            </Tooltip>
          </>
        )}
      </div>
      {!board.status && (
        <div className="flex items-center font-medium gap-2 relative">
          <PiWarningCircleLight size={23} color="#3b82f6" />
          This board is closed. Reopen the board to make changes.
          <span
            className="hover:text-blue-500 cursor-pointer"
            onClick={() => setIsLeaveModalOpen(true)}
          >
            Reopen board
          </span>
          <ConfirmAction
            isOpen={isLeaveModalOpen}
            onClose={(e) => {
              setIsLeaveModalOpen(false);
              e.preventDefault();
              e.stopPropagation();
            }}
            onConfirm={() => handleReOpenBoard(board?.id, board?.workspaceId)}
            title="Reopen Board"
            message="Are you sure you want to leave this workspace?"
            position="top-full right-0"
          />
        </div>
      )}
      <hr className="my-2 block lg:hidden" />
      <div className="flex items-center justify-end">
        {board?.BoardMembers.slice(0, 5).map((member, index) => (
          <div key={index} className="relative -ml-[3px] lg:-ml-[5px]">
            {member?.user?.avatar ? (
              <img
                data-tooltip-id={`img-${index}`}
                className="w-6 h-6 lg:w-7 lg:h-7 rounded-full border"
                src={member?.user?.avatar}
                alt=""
              />
            ) : (
              <span className="flex items-center justify-center capitalize bg-primary text-white text-sm w-6 h-6 lg:w-7 lg:h-7 rounded-full border">
                {member?.user?.username.slice(0, 2)}
              </span>
            )}
            <Tooltip
              id={`img-${index}`}
              clickable
              className="z-10"
              place="bottom"
            >
              {member?.user?.username}
            </Tooltip>
            {member?.user?.id === board?.ownerId && (
              <span className="absolute bottom-0 right-0" id="admin">
                <BsBookmarkStarFill />
              </span>
            )}
            <Tooltip
              anchorSelect="#admin"
              clickable
              className="z-10"
              place="bottom"
            >
              This member is an admin of this board
            </Tooltip>
          </div>
        ))}
        {board?.BoardMembers.length > 5 && (
          <div className="relative -ml-[3px] lg:-ml-[5px]">
            <span
              id="more"
              className="flex justify-center items-center w-6 h-6 lg:w-7 lg:h-7 rounded-full border bg-gray-400 cursor-pointer text-white text-xs"
            >
              +{board?.BoardMembers.length - 5}
            </span>
            <Tooltip
              anchorSelect="#more"
              clickable
              className="z-10"
              place="bottom"
            >
              {board?.BoardMembers.slice(5).map((member) => (
                <>
                  <div
                    key={member.user.id}
                    className="flex items-center gap-1 mb-3"
                  >
                    {member?.user?.avatar ? (
                      <img
                        className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border"
                        src={member?.user?.avatar}
                        alt=""
                      />
                    ) : (
                      <span className="flex items-center justify-center capitalize bg-primary text-white text-xs w-5 h-5 lg:w-6 lg:h-6 rounded-full border">
                        {member?.user?.username.slice(0, 2)}
                      </span>
                    )}
                    {member.user.username}
                  </div>
                </>
              ))}
            </Tooltip>
          </div>
        )}
        <span
          id="invite"
          className="text-sm h-8 ml-6 px-2 lg:px-3 rounded-md bg-primary dark:bg-gray-700 cursor-pointer text-white flex items-center gap-1"
          onClick={() => setIsInviteOpen(true)}
        >
          <IoPersonAddOutline size={15} /> Invite
        </span>
        <Tooltip
          anchorSelect="#invite"
          clickable
          className="z-10"
          place="bottom"
        >
          Invite
        </Tooltip>
      </div>
      <InviteMemberToBoard
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        boardId={board.id}
      />
    </div>
  );
}

export default BoardBar;
