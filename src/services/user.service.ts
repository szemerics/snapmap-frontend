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

  followUser<T>(targetUserId: string): Promise<T> {
    return HttpService.post(apiRoutes.followUser.replace(":targetUserId", targetUserId))
  },

  unfollowUser<T>(targetUserId: string): Promise<T> {
    return HttpService.delete(apiRoutes.followUser.replace(":targetUserId", targetUserId))
  },

  getFollowers<T>(userId: string): Promise<T> {
    return HttpService.get(apiRoutes.userFollowers.replace(":userId", userId))
  },

  getFollowing<T>(userId: string): Promise<T> {
    return HttpService.get(apiRoutes.userFollowing.replace(":userId", userId))
  },

  getFollowCounts<T>(userId: string): Promise<T> {
    return HttpService.get(apiRoutes.userFollowCounts.replace(":userId", userId))
  },
}
