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

export const createBoard_API = (data) => apiRequest.post("/boards", data);

export const closeBoard_API = (boardId) =>
  apiRequest.patch(`/boards/${boardId}/close`);

export const reOpenBoard_API = (boardId) =>
  apiRequest.patch(`/boards/${boardId}/reopen`);

export const toggleStarred_API = (boardId) =>
  apiRequest.patch(`/boards/${boardId}/starred`);

export const joinBoard = (data) => apiRequest.post(`/boards/join`, data);

export const leaveBoard = (boardId) =>
  apiRequest.patch(`/boards/${boardId}/leave`);

export const removeUserboard = (boardId, data) =>
  apiRequest.delete(`/boards/${boardId}/remove`, { data });

export const visibilityChange_API = (boardId, visibility) =>
  apiRequest.patch(`/boards/${boardId}/visibility`, { visibility });

export const renameBoard_API = (boardId, newname) =>
  apiRequest.put(`/boards/${boardId}/rename`, { newname });

export const updateColumnOrder_API = (boardId, data) =>
  apiRequest.put(`/boards/${boardId}/column/order`, data);

// Columns
export const createColumn_API = (newColumnData) =>
  apiRequest.post("/columns", newColumnData);

export const updateCardOrderInColumn_API = (columnId, data) =>
  apiRequest.put(`/columns/${columnId}/card/order`, data);

export const updateCardOrderDifferentColumn_API = (data) =>
  apiRequest.put(`/columns/card/order`, data);

export const renameList_API = (columnId, newname) =>
  apiRequest.put(`/columns/${columnId}/rename`, { newname });

// Cards
export const createCard_API = (newCardData) =>
  apiRequest.post("/cards", newCardData);

export const moveCard_API = (data) => apiRequest.put("/cards/move", data);

export const uploadCoverImage_API = (cardId, filename) =>
  apiRequest.put(`/cards/${cardId}/cover`, { filename });

export const createChecklist_API = (cardId, title) =>
  apiRequest.post(`/cards/${cardId}/checklist`, { title });

export const addChecklistItem_API = (checkListId, text) =>
  apiRequest.post("/cards/checklist/add", { checkListId, text });

export const toggleChecklistItem_API = (itemId) =>
  apiRequest.put("/cards/checklist/toggle", { itemId });

export const removeCheckList_API = (checkListId) =>
  apiRequest.delete(`/cards/checklist/${checkListId}`);

export const removeCheckListItem_API = (itemId) =>
  apiRequest.delete(`/cards/checklist/item/${itemId}`);

export const editDates_API = (cardId, data) =>
  apiRequest.put(`/cards/${cardId}/dates`, data);

export const dateComplete_API = (cardId, iscomplete) =>
  apiRequest.post(`/cards/${cardId}/complete`, { iscomplete });

export const joinCard_API = (cardId) =>
  apiRequest.post(`/cards/${cardId}/join`);
export const leaveCard_API = (cardId) =>
  apiRequest.post(`/cards/${cardId}/leave`);

export const addMemberToCard_API = (cardId, userId) =>
  apiRequest.post(`/cards/${cardId}/member`, { userId });

export const deleteMemberToCard_API = (cardId, userId) =>
  apiRequest.patch(`/cards/${cardId}/member`, { userId });

//Upload
export const uploadFile_API = (formData) => {
  return apiRequest.post(`/upload/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

//Labels
export const createLabel_API = (data) => apiRequest.post("/labels", data);
export const removeLabel_API = (labelId) =>
  apiRequest.delete(`/labels/${labelId}`);

export const updateLabel_API = (labelId, data) =>
  apiRequest.put(`/labels/${labelId}`, data);

export const toggleLabel_API = (data) =>
  apiRequest.post("/labels/toggle", data);

// User
export const createUser_API = (newUserData) =>
  apiRequest.post("/auth/register", newUserData, { withCredentials: false });

export const login_API = (userData) => apiRequest.post("/auth/login", userData);

export const logout_API = (userId) =>
  apiRequest.post("/auth/logout", { userId });

export const inviteMemberWorkspace_API = (WorkspaceId) =>
  apiRequest.post(`/invite/wp/${WorkspaceId}`, { WorkspaceId });
export const inviteMemberBoard_API = (boardId) =>
  apiRequest.post(`/invite/b/${boardId}`, { boardId });

export const verifyInviteLink = (token) =>
  apiRequest.get(`/invite/${token}`, { token });
