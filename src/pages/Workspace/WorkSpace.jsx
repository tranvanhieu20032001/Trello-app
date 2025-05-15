import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { io } from "socket.io-client"; // ✅ Dùng trực tiếp tại đây
import { toast } from "react-toastify";
import NofoundPage from "~/components/Workspace/Content/NofoundPage";
import GuestSidebar from "~/components/Workspace/Sidebar/GuestSidebar";
import Sidebar from "~/components/Workspace/Sidebar/Sidebar";
import { fetchWorkspaceData } from "~/store/slices/workSpaceSlice";
import socket from "~/utils/socket";

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

  useEffect(() => {
    if (!id) return;

    socket.emit("joinWorkspace", id);

    const handleNewMember = (username) => {
      toast.success(`${username} has been added to the workspace!`);
      dispatch(fetchWorkspaceData(id));
    };

    const handleRemoveMember = (username) => {
      toast.success(`${username} has been removed from the workspace.`);
      dispatch(fetchWorkspaceData(id));
    };

    const handleLeaveMember = (username) => {
      toast.success(`${username} has left the workspace.`);
      dispatch(fetchWorkspaceData(id));
    };

    socket.on("new-member", handleNewMember);
    socket.on("remove-member", handleRemoveMember);
    socket.on("leave-member", handleLeaveMember);

    return () => {
      socket.off("new-member", handleNewMember);
      socket.off("remove-member", handleRemoveMember);
      socket.off("leave-member", handleLeaveMember);
    };
  }, [id]);

  const isMember = workspaceData?.members?.some(
    (member) => member.userId === user.id
  );

  return (
    <div className="flex w-screen mx-auto text-primary h-screen">
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
          className="absolute -right-0 top-2 p-1.5 rounded-full shadow-md hover:bg-gray-200 hover:dark:bg-gray-700"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <IoIosArrowBack size={15} />
          ) : (
            <IoIosArrowForward size={15} />
          )}
        </button>
      </div>
      <div className="w-full">{isMember ? <Outlet /> : <NofoundPage />}</div>
    </div>
  );
};

export default WorkSpace;
