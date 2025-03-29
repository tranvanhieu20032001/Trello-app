import { createContext, useState, useContext, useEffect } from "react";
import { getWorkspaceById_API } from "~/apis";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceData, setWorkspaceData] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchWorkspaceData = async () => {
    if (!id) return;
    try {
      const response = await getWorkspaceById_API(id);
      setWorkspaceData(response.data.data);
      setWorkspaceName(response.data.data.name);
    } catch (error) {
      setError("Failed to fetch workspace data.");
      toast.error("Failed to fetch workspace data.");
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  return (
    <WorkspaceContext.Provider
      value={{ workspaceData, workspaceName, setWorkspaceName, error, fetchWorkspaceData }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
