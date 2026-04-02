export interface IFollowUser {
  user_id: string
  username: string
  profile_picture: {
    url: string
    public_id: string
  }
  bio: string | null
}

export interface IFollowCounts {
  followers: number
  following: number
}
