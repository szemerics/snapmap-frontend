export interface IUser {
  id: string
  bio: string | null
  created_at: string
  email: string
  password_hash: string
  photo_summaries: { photo_id: string; photo_url: string }[]
  profile_picture: {
    url: string
    public_id: string
  }
  role: "user" | "admin"
  username: string
}
