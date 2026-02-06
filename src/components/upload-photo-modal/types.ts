export type UploadPhotoFormData = {
  imageFile: File | null
  lat: number | null
  lng: number | null
  date_captured: string
  category: string
  camera_brand: string
  camera_model: string
  camera_type: string
  iso: number | null
  shutter_speed: string
  aperture: string
  lens: string
  extra_attachment: string
  caption: string
}
