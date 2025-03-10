import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Workspace/Sidebar/Sidebar";
import { WorkspaceProvider } from "~/context/workspaceContext";

const WorkSpace = () => {
  return (
    <WorkspaceProvider>
      <div className="grid grid-cols-5 lg:grid-cols-7 mx-auto text-primary">
        <Sidebar />
        <div className="col-span-4 lg:col-span-6">
          <Outlet />
        </div>
      </div>
    </WorkspaceProvider>
  );
};

export default WorkSpace;
