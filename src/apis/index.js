import { data } from "autoprefixer";
import apiRequest from "./apiService";

// Workspace
export const createWorkspace_API = (data) =>
  apiRequest.post("/workspace", data);
export const getWorkspaceByUser_API = () => apiRequest.get("/workspace");
export const getWorkspaceById_API = (workspaceId) =>
  apiRequest.get(`/workspace/${workspaceId}`);
export const joinWorkspace = (data) => apiRequest.post(`/workspace/join`, data);

export const searchUser = (query) =>
  apiRequest.get(`/workspace/search/user`, { params: { query } });

export const updateWorkspaceName = (data) =>
  apiRequest.post("/workspace/updateWorkspaceName", data);

export const leaveWorkspace = (workspaceId) =>
  apiRequest.patch(`/workspace/${workspaceId}/leave`);

export const removeUserWorkspace = (workspaceId, data) =>
  apiRequest.delete(`/workspace/${workspaceId}/remove`, { data });

// Boards
export const fetchBoardById_API = (boardId) =>
  apiRequest.get(`/boards/${boardId}`);
export const createBoard_API = (data) =>
  apiRequest.post("/boards", data);


// Columns
export const createColumn_API = (newColumnData) =>
  apiRequest.post("/columns", newColumnData);

// Cards
export const createCard_API = (newCardData) =>
  apiRequest.post("/cards", newCardData);

// User
export const createUser_API = (newUserData) =>
  apiRequest.post("/auth/register", newUserData, { withCredentials: false });

export const login_API = (userData) => apiRequest.post("/auth/login", userData);

export const logout_API = (userId) =>
  apiRequest.post("/auth/logout", { userId });

export const inviteMemberWorkspace_API = (WorkspaceId) =>
  apiRequest.post(`/invite/${WorkspaceId}`, { WorkspaceId });

export const verifyInviteLink = (token) =>
  apiRequest.get(`/invite/${token}`, { token });
