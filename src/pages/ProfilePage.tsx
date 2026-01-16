import api from "@/api/api"
import ProfileCard from "@/components/profile/ProfileCard"
import ProfilePhotos from "@/components/profile/ProfilePhotos"
import { Spinner } from "@/components/ui/spinner"
// import type { IPhoto } from "@/interfaces/IPhoto"
import type { IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react"

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState<IUser>()
  // const [userPhotos, setUserPhotos] = useState<IPhoto[]>([])

  useEffect(() => {
    async function fetchProfile() {
      const user: IUser = await api.User.getCurrentUser().then((res) => res.data)
      // const photos: IPhoto[] = await api.Photo.getUserPhotos().then((res) => res.data)
      setCurrentUser(user)
      // setUserPhotos(photos)
    }

    fetchProfile()
  }, [])

  if (!currentUser) {
    return <Spinner className="size-8" />
  }

  return (
    <>
      <ProfileCard user={currentUser} />
      <ProfilePhotos photoSummaries={currentUser.photo_summaries} />
      {/* <Posts user={currentUser} /> */}
    </>
  )
}

export default ProfilePage
