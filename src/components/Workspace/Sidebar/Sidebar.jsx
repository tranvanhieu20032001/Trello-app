import { CiUser, CiViewBoard } from "react-icons/ci";
import { IoIosAdd, IoIosArrowRoundForward } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { Link, NavLink, useParams } from "react-router-dom";
import { useWorkspace } from "~/context/WorkspaceContext";
import astronaut from "~/assets/astronaut.png";
import CreateBoardModal from "~/components/Boards/CreateBoardModal";
import { useState } from "react";
import { useSelector } from "react-redux";
import { PiDotsThreeBold } from "react-icons/pi";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const { workspaceName, workspaceData } = useWorkspace();
  const user = useSelector((state) => state.auth.user);
  const userBoards =
    workspaceData?.members
      ?.find((m) => m.userId === user.id)
      ?.user?.boards.filter((a) => a.workspaceId === id) || [];

  return (
    <div>
      <div className="flex items-center gap-2 p-2 border-b">
        <div className="w-8 h-8 flex justify-center items-center bg-green-600 text-white rounded-md font-semibold text-sm">
          {workspaceName.slice(0, 1).toUpperCase()}
        </div>
        <span className="text-sm">{workspaceName}</span>
      </div>
      <div className="">
        <NavLink
          to={`/workspace/${id}`}
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
          to={`/workspace/${id}/members`}
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
      <div className="p-2 space-y-2 relative">
        <h1 className="text-xs flex items-center gap-1 justify-between">
          <span className="flex items-center gap-1">
            <MdDashboard size={15} />
            Your Boards
          </span>
          <span
            className="p-1 rounded-sm hover:bg-gray-200"
            onClick={() => setIsOpen(true)}
          >
            <IoIosAdd size={20} />
          </span>
        </h1>

        <div className="w-full">
          {userBoards.length > 0 ? (
            userBoards.map((board) => (
              <Link
                to={`/board/${board.id}`}
                key={board.id}
                className="flex gap-2 items-center w-full group p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <img
                  src={board?.background}
                  alt=""
                  className="w-9 h-6 object-cover object-center rounded-sm"
                />
                <div className="flex items-center justify-between flex-1">
                  <span className="text-sm capitalize">{board.title}</span>
                  <div className="items-center gap-2 hidden group-hover:flex">
                    <span className="inline-block p-1 rounded-sm hover:text-yellow-500">
                      {board?.starred ? (
                        <FaStar size={15} color="#ffd600" />
                      ) : (
                        <FaRegStar size={15} />
                      )}
                    </span>
                    <span className="hover:text-red-500">
                      <IoClose size={20} />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-3 text-sm space-y-3">
              <div className="flex items-center justify-center">
                <img src={astronaut} alt="" className="h-28" />
              </div>
              <p className="">
                You don’t have any boards in this Workspace yet. Boards you
                create or join will show up here.
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
    </div>
  );
};

export default Sidebar;
