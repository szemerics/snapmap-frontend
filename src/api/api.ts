import type { IUser } from "@/interfaces/IUser"
import axiosInstance from "./axios.config"
import type { IPhoto } from "@/interfaces/IPhoto"

const Auth = {
  login: (email: string, password: string) =>
    axiosInstance.post("/auth/login", null, {
      params: { email, password },
    }),
  register: (username: string, email: string, password: string) =>
    axiosInstance.post("/auth/register", { username, email, password }),
}

const User = {
  getCurrentUser: () => axiosInstance.get<IUser>("/users/me"),
  getUserByUsername: (username: string) => axiosInstance.get<IUser>(`/users/${username}`),
}

const Photo = {
  getUserPhotos: (username?: string) => axiosInstance.get<IPhoto[]>("/photos/user-photos", { params: { username } }),
  getAllPhotos: () => axiosInstance.get<IPhoto[]>("/photos"),
  getPhotoById: (photo_id: string) => axiosInstance.get<IPhoto>(`/photos/${photo_id}`),
}

const api = {
  Auth,
  User,
  Photo,
}

export default api
