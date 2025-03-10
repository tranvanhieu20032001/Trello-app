import { createContext, useState, useContext } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaceName, setWorkspaceName] = useState("");

  return (
    <WorkspaceContext.Provider value={{ workspaceName, setWorkspaceName }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);