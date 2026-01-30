import type { Dispatch, SetStateAction } from "react"
import type { UploadPhotoFormData } from "./types"

export const getDefaultUploadData = (): UploadPhotoFormData => ({
  imageFile: null,
  lat: 0,
  lng: 0,
  date_captured: new Date().toISOString(),
  category: "",
  camera_brand: "",
  camera_model: "",
  camera_type: "",
  lens: "",
  extra_attachment: "",
  iso: 0,
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
