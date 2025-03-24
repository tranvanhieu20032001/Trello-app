import { CiUser, CiViewBoard } from "react-icons/ci";
import { NavLink, useParams } from "react-router-dom";
import { useWorkspace } from "~/context/WorkspaceContext";

const Sidebar = () => {
  const { id } = useParams();
  const { workspaceName } = useWorkspace();
  return (
    <div className="col-span-1 shadow-md h-screen bg-light dark:bg-dark text-primary dark:text-secondary">
      <div className="flex items-center gap-2 p-2 border-b">
        <div className="w-8 h-8 flex justify-center items-center bg-green-600 text-white rounded-md font-semibold text-lg">
        {workspaceName.slice(0, 2).toUpperCase()}
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
    </div>
  );
};

export default Sidebar;
