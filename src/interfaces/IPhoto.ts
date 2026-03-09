export interface IUserSummary {
  id: string
  username: string
  profile_picture: {
    url: string
    public_id: string
  }
  bio: string | null
}
export interface IComment {
  comment_id: string
  user_summary: IUserSummary
  comment_date: string
  content: string
  replies: IComment[]
}

export interface IPhoto {
  id: string
  user_summary: IUserSummary
  photo_url: string
  cloudinary_public_id: string
  location?: {
    lat: number
    lng: number
  }
  date_captured: string
  category?: string
  gear?: {
    camera: {
      brand: string
      model: string
      type: string
    }
    lens: string
    extra_attachment: string
  }
  settings_used?: {
    iso: number
    shutter_speed: string
    aperture: string
  }
  date_posted: string
  caption?: string
  likes: IUserSummary[]
  comments: IComment[]
}

export interface IUploadPhoto {
  imageFile: File
  date_captured: string
  location?: {
    lat: number
    lng: number
  }
  category?: string
  gear?: {
    camera: {
      brand: string
      model: string
      type: string
    }
    lens: string
    extra_attachment: string
  }
  settings_used?: {
    iso: number
    shutter_speed: string
    aperture: string
  }
  caption?: string
}
