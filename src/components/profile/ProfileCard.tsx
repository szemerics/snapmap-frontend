import { Card, CardContent, CardHeader } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"
import type { IUser } from "@/interfaces/IUser"
import { Button } from "../ui/button"
import { useAuthContext } from "@/context/AuthContext"
import { useEffect, useMemo, useState } from "react"
import { userService } from "@/services/user.service"
import type { IFollowCounts, IFollowUser } from "@/interfaces/IFollow"
import { toast } from "sonner"
import type { FollowDialogType } from "./FollowDialog"

type ProfileCardProps = {
  targetUser: IUser
  openFollowDialog: (type: FollowDialogType) => void
}

const ProfileCard = ({ targetUser, openFollowDialog }: ProfileCardProps) => {
  const { currentUser } = useAuthContext()
  const [followCounts, setFollowCounts] = useState<IFollowCounts>({ followers: 0, following: 0 })
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  const isOwnProfile = useMemo(() => currentUser?.id === targetUser.id, [currentUser?.id, targetUser.id])

  const fetchFollowCounts = async () => {
    const counts = await userService.getFollowCounts<IFollowCounts>(targetUser.id)
    setFollowCounts(counts)
  }

  const fetchFollowingState = async () => {
    if (!currentUser || isOwnProfile) {
      setIsFollowing(false)
      return
    }

    const following = await userService.getFollowing<IFollowUser[]>(currentUser.id)
    setIsFollowing(following.some((user) => user.user_id === targetUser.id))
  }

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const counts = await userService.getFollowCounts<IFollowCounts>(targetUser.id)
        if (isMounted) {
          setFollowCounts(counts)
        }

        if (!currentUser || isOwnProfile) {
          if (isMounted) {
            setIsFollowing(false)
          }
          return
        }

        const following = await userService.getFollowing<IFollowUser[]>(currentUser.id)
        if (isMounted) {
          setIsFollowing(following.some((user) => user.user_id === targetUser.id))
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [currentUser, isOwnProfile, targetUser.id])

  const handleFollowChange = async () => {
    if (!currentUser || isOwnProfile || isFollowLoading) return

    try {
      setIsFollowLoading(true)

      if (isFollowing) {
        await userService.unfollowUser(targetUser.id)
      } else {
        await userService.followUser(targetUser.id)
      }

      await Promise.all([fetchFollowCounts(), fetchFollowingState()])
    } catch (error) {
      toast.error(isFollowing ? "Could not unfollow user" : "Could not follow user")
    } finally {
      setIsFollowLoading(false)
    }
  }

  const Header = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex justify-center items-center w-full gap-4">
        <div className="flex flex-col w-full text-right cursor-pointer" onClick={() => openFollowDialog("follower")}>
          <span>{followCounts.followers}</span>
          <span className="text-muted-foreground text-xs">Followers</span>
        </div>
        <Avatar size="lg">
          <AvatarImage src={targetUser.profile_picture.url}></AvatarImage>
        </Avatar>
        <div className="flex flex-col w-full cursor-pointer" onClick={() => openFollowDialog("following")}>
          <span>{followCounts.following}</span>
          <span className="text-muted-foreground text-xs">Following</span>
        </div>
      </div>
      <h2 className="">{targetUser.username}</h2>
      {!isOwnProfile && (
        <Button
          type="button"
          variant={isFollowing ? "outline" : "default"}
          className="cursor-pointer min-w-24"
          onClick={handleFollowChange}
          disabled={isFollowLoading}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  )

  return (
    <>
      <Card className="flex gap-1 rounded-none">
        <CardHeader>
          <Header />
        </CardHeader>
        <CardContent className="text-muted-foreground text-center text-xs">{targetUser.bio}</CardContent>
      </Card>
    </>
  )
}

export default ProfileCard
