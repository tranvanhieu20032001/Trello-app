import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import NofoundPage from "~/components/Workspace/Content/NofoundPage";
import GuestSidebar from "~/components/Workspace/Sidebar/GuestSidebar";
import Sidebar from "~/components/Workspace/Sidebar/Sidebar";
import { useWorkspace } from "~/context/workspaceContext";

const WorkSpace = () => {
  const { workspaceData } = useWorkspace();
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isMember = workspaceData?.members?.some(
    (member) => member.userId === user.id
  );
  return (
    <div
      className={`${
        !isSidebarOpen ? "flex w-full" : "grid grid-cols-5 lg:grid-cols-7"
      } mx-auto text-primary`}
    >
      <div
        className={`${
          !isSidebarOpen ? "w-8" : "col-span-1"
        } relative col-span-1 shadow-md h-screen bg-light dark:bg-dark text-primary dark:text-secondary`}
      >
        {isSidebarOpen ? (
          isMember ? (
            <Sidebar isSidebarOpen={isSidebarOpen} />
          ) : (
            <GuestSidebar />
          )
        ) : (
          ""
        )}
        <button
          className="absolute -right-0 top-2 p-1.5 rounded-full shadow-md hover:bg-gray-200"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <IoIosArrowBack size={15} />
          ) : (
            <IoIosArrowForward size={15} />
          )}
        </button>
      </div>
      <div
        className={`${!isSidebarOpen ? "w-full" : "col-span-4 lg:col-span-6"}`}
      >
        {isMember ? <Outlet /> : <NofoundPage />}
      </div>
    </div>
  );
};

export default WorkSpace;
