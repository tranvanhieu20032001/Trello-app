import { CiUser, CiViewBoard } from "react-icons/ci";
import { IoIosAdd, IoIosArrowRoundForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import astronaut from "~/assets/astronaut.png";
import CreateBoardModal from "~/components/Modal/CreateBoardModal";
import ConfirmAction from "../../Modal/ConfirmAction";
import { useBoardActions } from "~/utils/hooks/useBoardActions";
import lock from "~/assets/lock.svg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  const workspaceName = workspaceData?.name || "Workspace";

  const boards = workspaceData?.boards?.filter(
    (board) =>
      workspaceData.members.some((member) => member.userId === user.id) &&
      board.status &&
      board.BoardMembers.some((boardmember) => boardmember.userId === user?.id)
  );

  const isMemberBoard = useMemo(
    () => workspaceData?.members.some((member) => member.userId === user.id),
    [workspaceData, user]
  );

  const { handleCloseBoard } = useBoardActions();

  return (
    <>
      <div className="flex items-center gap-2 border-b h-14">
        <div className="w-8 h-8 m-2 flex justify-center items-center bg-green-600 text-white rounded-md font-semibold text-sm">
          {workspaceName.slice(0, 1).toUpperCase()}
        </div>
        <span className="text-sm">{workspaceName}</span>
      </div>
      <div>
        <NavLink
          to={`/workspace/${id || workspaceData?.id}`}
          end
          className={({ isActive }) =>
            `flex items-center gap-2 py-1.5 px-4 my-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isActive ? "bg-gray-200 dark:bg-gray-700" : ""
            }`
          }
        >
          <CiViewBoard size={20} />
          Boards
        </NavLink>
        <NavLink
          to={`/workspace/${id || workspaceData?.id}/members`}
          className={({ isActive }) =>
            `flex items-center gap-2 py-1.5 px-4 my-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isActive ? "bg-gray-200 dark:bg-gray-700" : ""
            }`
          }
        >
          <CiUser size={20} />
          Members
        </NavLink>
      </div>
      <hr />
      <div className="flex flex-col flex-grow">
        <div className="p-2 space-y-2 relative flex-grow">
          <h1 className="text-xs flex items-center gap-1 justify-between">
            <span className="flex items-center gap-1">
              <MdDashboard size={15} />
              Your Boards
            </span>
            {isMemberBoard && (
              <span
                className="p-1 rounded-sm hover:bg-gray-200 cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <IoIosAdd size={20} />
              </span>
            )}
          </h1>

          <div className="w-full">
            {boards?.length
              ? boards.map((board, index) => (
                  <div
                    onClick={() => navigate(`/board/${board.id}`)}
                    key={board.id}
                    className="flex gap-2 items-center w-full group p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
                  >
                    <img
                      src={board?.background}
                      alt=""
                      className="w-9 h-6 object-cover object-center rounded-sm"
                    />
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm">{board.title}</span>
                      <div className="items-center gap-2 hidden group-hover:flex">
                        <span className="inline-block p-1 rounded-sm">
                          {!board?.UserBoardPreference[0]?.starred ? (
                           <FaRegStar className="" size={15} />
                          ) : (
                           <FaStar size={15} color="#eab308" />
                          )}
                        </span>
                        {board?.ownerId === user.id && (
                          <>
                            <span
                              data-tooltip-id={`closeboard-${board.id}`}
                              className="hover:text-red-500 cursor-pointer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveIndex(index);
                              }}
                            >
                              <IoClose size={20} />
                            </span>
                            <Tooltip
                              id={`closeboard-${board.id}`}
                              place="bottom"
                              clickable
                              className="z-10"
                            >
                              Close board
                            </Tooltip>
                          </>
                        )}
                      </div>
                      <ConfirmAction
                        isOpen={activeIndex === index}
                        onClose={(e) => {
                          setActiveIndex(null);
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onConfirm={(e) => {
                          handleCloseBoard(board.id, board.workspaceId);
                          setActiveIndex(null);
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        title="Close Board"
                        message="Are you sure you want to close this board?"
                        position="left-0 top-full"
                      />
                    </div>
                  </div>
                ))
              : isMemberBoard && (
                  <div className="px-3 text-sm space-y-3">
                    <div className="flex items-center justify-center">
                      <img src={astronaut} alt="" className="h-28" />
                    </div>
                    <p>
                      You don’t have any boards in this Workspace yet. Boards
                      you create or join will show up here.
                    </p>
                    <div className="flex items-center font-medium relative justify-center">
                      <span
                        onClick={() => setIsOpen(true)}
                        className="border-b border-b-primary cursor-pointer"
                      >
                        Create a board
                      </span>
                      <IoIosArrowRoundForward size={20} />
                    </div>
                  </div>
                )}
          </div>
          <CreateBoardModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            position="left-full top-0"
          />
        </div>
        {!isMemberBoard && (
          <div className="space-y-3 p-2 m-2 rounded-md bg-gray-200 dark:text-primary">
            <div className="flex items-center justify-center">
              <img src={lock} alt="" className="w-20 h-auto" />
            </div>
            <h6 className="text-xs font-medium text-center">
              You are a guest in this Workspace.
            </h6>
            <p className="text-xs font-normal text-center">
              To see other boards and members in this Workspace, an admin must
              add you as a Workspace member.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
