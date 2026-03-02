import ProfileCard from "@/components/profile/ProfileCard"
import ProfilePhotos from "@/components/profile/ProfilePhotos"
import type { IUser } from "@/interfaces/IUser"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { userService } from "@/services/user.service"
import ProfileMenu from "@/components/profile/ProfileMenu"
import { Skeleton } from "@/components/ui/skeleton"

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
    return (
      <div className="space-y-4 mt-3">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex justify-center items-center w-full gap-4">
            <div className="flex flex-col w-full text-right space-y-1">
              <Skeleton className="h-4 w-10 ml-auto" />
              <Skeleton className="h-3 w-20 ml-auto" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full aspect-square" />
            <div className="flex flex-col w-full space-y-1">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="grid grid-cols-3">
          <Skeleton className="h-32 w-full aspect-square rounded-none border border-background" />
          <Skeleton className="h-32 w-full aspect-square rounded-none border border-background" />
          <Skeleton className="h-32 w-full aspect-square rounded-none border border-background" />
          <Skeleton className="h-32 w-full aspect-square rounded-none border border-background" />
          <Skeleton className="h-32 w-full aspect-square rounded-none border border-background" />
        </div>
      </div>
    )
  }

  return (
    <>
      <ProfileCard targetUser={targetUser} />
      <ProfilePhotos targetUser={targetUser} onPhotoDelete={fetchProfile} />
      <ProfileMenu targetUser={targetUser} />
    </>
  )
}

export default ProfilePage
