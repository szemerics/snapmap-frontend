export interface IPhoto {
  id: string
  user_summary: {
    user_id: string
    username: string
    profile_picture_url: string
    bio: string | null
  }
  photo_url: string
  cloudinary_public_id: string
  location: {
    lat: number
    lng: number
  }
  date_captured: string
  category: string
  gear: {
    camera: {
      brand: string
      model: string
      type: string
    }
    lens: string
    extra_attachment: string
  }
  settings_used: any | null
  date_posted: string
  caption: string
  likes: number
  comments: any | null
}
