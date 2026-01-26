import { apiRoutes } from "./api/api-routes"
import { HttpService } from "./http.service"

type authLoginParams = {
  email: string
  password: string
}

type authRegisterParams = {
  username: string
  email: string
  password: string
}

export const authService = {
  login<T>(params?: authLoginParams): Promise<T> {
    return HttpService.post(apiRoutes.login, params)
  },
  register<T>(params?: authRegisterParams): Promise<T> {
    return HttpService.post(apiRoutes.register, params)
  },
}
