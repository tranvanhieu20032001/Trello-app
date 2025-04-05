import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import NofoundPage from "~/components/Workspace/Content/NofoundPage";
import GuestSidebar from "~/components/Workspace/Sidebar/GuestSidebar";
import Sidebar from "~/components/Workspace/Sidebar/Sidebar";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";

const WorkSpace = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const workspaceData = useSelector((state) => state.workspace.workspaceData);
  useEffect(() => {
    if (id) {
      dispatch(fetchWorkspaceData(id));
    }
  }, [id, dispatch]);

  // console.log("workspaceData:", workspaceData);

  const isMember = workspaceData?.members?.some(
    (member) => member.userId === user.id
  );

  return (
    <div
      className="flex w-screen mx-auto text-primary h-screen"
    >
      <div
        className={`${
          !isSidebarOpen ? "w-8" : "w-72"
        } relative flex flex-col flex-grow shadow-md h-full bg-light dark:bg-dark text-primary dark:text-secondary`}
      >
        {isSidebarOpen ? (
          isMember ? (
            <Sidebar isSidebarOpen={isSidebarOpen} />
          ) : (
            <GuestSidebar />
          )
        ) : null}
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
        className="w-full"
      >
        {isMember ? <Outlet /> : <NofoundPage />}
      </div>
    </div>
  );
};

export default WorkSpace;
