import api from "@/api/api"
import ProfileCard from "@/components/profile/ProfileCard"
import ProfilePhotos from "@/components/profile/ProfilePhotos"
import { Spinner } from "@/components/ui/spinner"
import type { IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ProfilePage = () => {
  const { username } = useParams()
  const [currentUser, setCurrentUser] = useState<IUser>()

  useEffect(() => {
    async function fetchProfile() {
      const user: IUser = await api.User.getUserByUsername(username!).then((res) => res.data)
      setCurrentUser(user)
    }

    fetchProfile()
  }, [])

  if (!currentUser) {
    return <Spinner className="size-8" />
  }

  return (
    <>
      <ProfileCard user={currentUser} />
      <ProfilePhotos photoSummaries={Array(5).fill(currentUser.photo_summaries).flat()} />
    </>
  )
}

export default ProfilePage
