export type UploadPhotoFormData = {
  imageFile: File | null
  lat: number
  lng: number
  date_captured: string
  category: string
  camera_brand: string
  camera_model: string
  camera_type: string
  iso: number
  shutter_speed: string
  aperture: string
  lens: string
  extra_attachment: string
  caption: string
}
