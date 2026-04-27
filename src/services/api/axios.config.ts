import axios from "axios"
import { getStoredAccessToken, setStoredAccessToken } from "../../lib/auth-token";
import { apiRoutes } from "./api-routes";
import { authService } from "../auth.service";
import type { IUser } from "@/interfaces/IUser";

const baseURL = `${import.meta.env.VITE_API_URL}`

const axiosInstance = axios.create({ baseURL, withCredentials: true })

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 
      && !originalRequest._retry 
      && originalRequest.url !== apiRoutes.refresh) {
        originalRequest._retry = true;
        try {
          const { access_token: newToken } = await authService.refresh<{ access_token: string, user: IUser }>()
          setStoredAccessToken(newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed", refreshError)
        }
      }


      return Promise.reject(error)
    }
)

export default axiosInstance
