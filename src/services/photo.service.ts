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

  getMyPhotos<T>(): Promise<T> {
    return HttpService.get(apiRoutes.myPhotos)
  },
}
