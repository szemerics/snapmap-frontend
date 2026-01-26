import { apiRoutes } from "./api/api-routes"
import { HttpService } from "./http.service"

export const userService = {
  getUsers<T>(params?: { username?: string }): Promise<T> {
    return HttpService.get(apiRoutes.users, { params })
  },

  getMyUser<T>(): Promise<T> {
    return HttpService.get(apiRoutes.myUser)
  },
}
