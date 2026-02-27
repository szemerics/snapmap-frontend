import { apiRoutes } from "./api/api-routes"
import { HttpService } from "./http.service"

export const userService = {
  getUsers<T>(params?: { username?: string }): Promise<T> {
    return HttpService.get(apiRoutes.users, { params })
  },

  getMyUser<T>(): Promise<T> {
    return HttpService.get(apiRoutes.myUser)
  },

  updateProfile<T>(params?: { username?: string; bio?: string }): Promise<T> {
    return HttpService.put(apiRoutes.updateProfile, params)
  },

  updateProfilePicture<T>(formData: FormData): Promise<T> {
    return HttpService.put(apiRoutes.updateProfilePicture, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}
