import type { IUploadPhoto } from "@/interfaces/IPhoto"
import { apiRoutes } from "./api/api-routes"
import { HttpService } from "./http.service"

type PhotoFilters = {
  photo_type?: "map" | "post"
  username?: string
  photo_id?: string
}

type PostParams = {
  photo_data: IUploadPhoto
  uploaded_file: File
}

export const photoService = {
  getPhotos<T>(params?: PhotoFilters): Promise<T> {
    return HttpService.get(apiRoutes.photos, { params })
  },
  postPhoto<T>(formData: FormData): Promise<T> {
    return HttpService.post(apiRoutes.photos, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },
}
