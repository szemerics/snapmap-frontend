import { apiRoutes } from "./api/api-routes"
import { HttpService } from "./http.service"

type PhotoFilters = {
  photo_type?: "map" | "post"
  username?: string
  photo_id?: string
}

export const photoService = {
  getPhotos<T>(params?: PhotoFilters): Promise<T> {
    return HttpService.get(apiRoutes.photos, { params })
  },
  getFollowingPhotos<T>(): Promise<T> {
    return HttpService.get(apiRoutes.followingPhotos)
  },
  postPhoto<T>(formData: FormData): Promise<T> {
    return HttpService.post(apiRoutes.photos, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
  deletePhoto<T>(photoId: string): Promise<T> {
    return HttpService.delete(`${apiRoutes.photos}/${photoId}`)
  },
  likePhoto<T>(photoId: string): Promise<T> {
    return HttpService.post(`${apiRoutes.likePhoto.replace(":photoId", photoId)}`)
  },
  unlikePhoto<T>(photoId: string): Promise<T> {
    return HttpService.delete(`${apiRoutes.likePhoto.replace(":photoId", photoId)}`)
  },
  addComment<T>(photoId: string, content: string): Promise<T> {
    return HttpService.post(`${apiRoutes.addComment.replace(":photoId", photoId)}`, { content })
  },
  addReply<T>(photoId: string, commentId: string, content: string): Promise<T> {
    return HttpService.post(`${apiRoutes.addReply.replace(":photoId", photoId).replace(":commentId", commentId)}`, {
      content,
    })
  },
}
