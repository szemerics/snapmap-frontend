export interface IUser {
  _id: string
  bio: string | null
  created_at: string
  email: string
  gears: string[] | null
  password_hash: string
  photo_summaries: { photo_id: string; photo_url: string }[]
  profile_picture_url: string | null
  role: "user" | "admin"
  username: string
}
