import axios from "axios";
import { API_ENDPOINT } from "~/utils/constants";

export const fetchBoardById_API = async (boardId) => {
  const response = await axios.get(`${API_ENDPOINT}/${boardId}`);
  return response.data;
};
