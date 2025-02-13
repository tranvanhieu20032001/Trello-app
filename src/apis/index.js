import axios from "axios";
import { API_ENDPOINT } from "~/utils/constants";

//********************  Boards *************************//
// export const fetchBoardById_API = async (boardId) => {
//   const response = await axios.get(`${API_ENDPOINT}/boards/${boardId}`);
//   return response.data;
// };

//********************  Columns *************************//
export const createColumn_API = async (newColumnData) => {
  const response = await axios.post(`${API_ENDPOINT}/columns`, newColumnData);
  return response.data;
};

//********************  Cards *************************//
export const createCard_API = async (newCardData) => {
  const response = await axios.post(`${API_ENDPOINT}/cards`, newCardData);
  return response.data;
};
