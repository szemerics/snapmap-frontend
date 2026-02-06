import type { Dispatch, SetStateAction } from "react"
import type { UploadPhotoFormData } from "./types"
import type { IUploadPhoto } from "@/interfaces/IPhoto"

export const getDefaultUploadData = (): UploadPhotoFormData => ({
  imageFile: null,
  lat: null,
  lng: null,
  date_captured: new Date().toISOString(),
  category: "",
  camera_brand: "",
  camera_model: "",
  camera_type: "",
  lens: "",
  extra_attachment: "",
  iso: null,
  shutter_speed: "",
  aperture: "",
  caption: "",
})

export const handleUploadDataChange = (
  uploadData: UploadPhotoFormData,
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>,
  field: keyof UploadPhotoFormData,
  value: any
): void => {
  setUploadData({ ...uploadData, [field]: value })
}

export function formatDataBeforeSubmit(data: UploadPhotoFormData): IUploadPhoto {
  if (!data.imageFile) {
    throw new Error("Image file is required")
  }

  const payload: IUploadPhoto = {
    imageFile: data.imageFile,
    date_captured: data.date_captured,
  }

  if (data.lat !== null && data.lng !== null) {
    payload.location = {
      lat: data.lat,
      lng: data.lng,
    }
  }

  if (data.category) {
    payload.category = data.category
  }

  if (data.camera_brand || data.camera_model || data.camera_type || data.lens || data.extra_attachment) {
    payload.gear = {
      camera: {
        brand: data.camera_brand || "",
        model: data.camera_model || "",
        type: data.camera_type || "",
      },
      lens: data.lens || "",
      extra_attachment: data.extra_attachment || "",
    }
  }

  if (data.iso || data.shutter_speed || data.aperture) {
    payload.settings_used = {
      iso: data.iso || 0,
      shutter_speed: data.shutter_speed || "",
      aperture: data.aperture || "",
    }
  }

  if (data.caption) {
    payload.caption = data.caption
  }

  return payload
}
