import axios from "axios";
import { API_ENDPOINT } from "~/utils/constants";

const apiRequest = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await apiRequest.post("auth/refresh");
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    localStorage.removeItem("accessToken");
    // window.location.href = "/login";
    throw new Error(error);
  }
};

apiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiRequest(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiRequest;
