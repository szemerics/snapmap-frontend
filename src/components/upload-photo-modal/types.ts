export type UploadPhotoFormData = {
  imageFile: File | null
  lat: number
  lng: number
  date_captured: string
  category: string
  camera_brand: string
  camera_model: string
  camera_type: string
  lens: string
  extra_attachment: string
  settings_used: any | null
  caption: string
}
