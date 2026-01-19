import api from "@/api/api"
import ProfileCard from "@/components/profile/ProfileCard"
import ProfilePhotos from "@/components/profile/ProfilePhotos"
import { Spinner } from "@/components/ui/spinner"
import type { IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ProfilePage = () => {
  const { username } = useParams()
  const [targetUser, setTargetUser] = useState<IUser>()

  useEffect(() => {
    async function fetchProfile() {
      const user: IUser = await api.User.getUserByUsername(username!).then((res) => res.data)
      setTargetUser(user)
    }

    fetchProfile()
  }, [username])

  if (!targetUser) {
    return <Spinner className="size-8" />
  }

  return (
    <>
      <ProfileCard user={targetUser} />
      <ProfilePhotos photoSummaries={targetUser.photo_summaries} username={targetUser.username} />
    </>
  )
}

export default ProfilePage
