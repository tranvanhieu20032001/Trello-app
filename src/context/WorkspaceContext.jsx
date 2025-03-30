import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getWorkspaceById_API } from "~/apis";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { startLoading, stopLoading } from "~/store/slices/loadingSlice"; // Import loading actions
import { useDispatch } from "react-redux";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceData, setWorkspaceData] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const { id } = useParams();
  const fetchWorkspaceData = useCallback(
    async (id) => {
      if (!id || workspaceData?.id === id) return;
      dispatch(startLoading());
      try {
        const response = await getWorkspaceById_API(id);
        setWorkspaceData(response.data.data);
        setWorkspaceName(response.data.data.name);
      } catch (error) {
        setError("Failed to fetch workspace data.");
        toast.error("Failed to fetch workspace data.");
      } finally {
        setTimeout(() => {
          dispatch(stopLoading());
        }, 800);
      }
    },
    [workspaceData]
  );

  useEffect(() => {
    fetchWorkspaceData(id);
  }, [id, fetchWorkspaceData]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceData,
        workspaceName,
        setWorkspaceName,
        error,
        fetchWorkspaceData,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

// Hook dùng trong component con
export const useWorkspace = () => useContext(WorkspaceContext);
