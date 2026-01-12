import axiosInstance from "./axios.config"

const Auth = {
  login: (email: string, password: string) =>
    axiosInstance.post("/auth/login", null, {
      params: { email, password },
    }),
  register: (username: string, email: string, password: string) =>
    axiosInstance.post("/auth/register", { username, email, password }),
}

const api = {
  Auth,
}

export default api
