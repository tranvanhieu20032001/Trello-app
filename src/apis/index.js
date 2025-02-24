import apiRequest from "./apiService";

// Workspace
export const createWorkspace_API = (data) =>
  apiRequest.post("/workspace", data);
export const getWorkspaceByUser_API = () => apiRequest.get("/workspace");

// Boards
export const fetchBoardById_API = (boardId) =>
  apiRequest.get(`/boards/${boardId}`);

// Columns
export const createColumn_API = (newColumnData) =>
  apiRequest.post("/columns", newColumnData);

// Cards
export const createCard_API = (newCardData) =>
  apiRequest.post("/cards", newCardData);

// User
export const createUser_API = (newUserData) =>
  apiRequest.post("/auth/register", newUserData, { withCredentials: false });

export const login_API = (userData) =>
  apiRequest.post("/auth/login", userData);

export const logout_API = (userId) =>
  apiRequest.post("/auth/logout", { userId });
