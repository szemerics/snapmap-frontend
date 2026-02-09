import ProfileCard from "@/components/profile/ProfileCard"
import ProfilePhotos from "@/components/profile/ProfilePhotos"
import { Spinner } from "@/components/ui/spinner"
import type { IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { userService } from "@/services/user.service"

const ProfilePage = () => {
  const { username } = useParams()
  const [targetUser, setTargetUser] = useState<IUser>()

  async function fetchProfile() {
    const response = await userService.getUsers<IUser[]>({ username })
    const user = response[0]
    setTargetUser(user)
  }

  useEffect(() => {
    fetchProfile()
  }, [username])

  if (!targetUser) {
    return <Spinner className="size-8" />
  }

  return (
    <>
      <ProfileCard targetUser={targetUser} />
      <ProfilePhotos targetUser={targetUser} onPhotoDelete={fetchProfile} />
    </>
  )
}

export default ProfilePage
