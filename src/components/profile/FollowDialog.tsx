import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { userService } from "@/services/user.service"
import type { IUser } from "@/interfaces/IUser"
import { Button } from "../ui/button"
import { useAuthContext } from "@/context/AuthContext"
import { toast } from "sonner"
import type { IFollowUser } from "@/interfaces/IFollow"
import { useNavigate } from "react-router-dom"

export type FollowDialogType = "following" | "follower"

interface FollowDialogProps {
  type: FollowDialogType
  targetUser: IUser
  isFollowDialogOpen: boolean
  setIsFollowDialogOpen: Dispatch<SetStateAction<boolean>>
}

const FollowDialog = ({ type, targetUser, isFollowDialogOpen, setIsFollowDialogOpen }: FollowDialogProps) => {
  return (
    <>
      {type === "following" ? (
        <FollowingDialog
          targetUser={targetUser}
          isFollowDialogOpen={isFollowDialogOpen}
          setIsFollowDialogOpen={setIsFollowDialogOpen}
        />
      ) : (
        <FollowerDialog
          targetUser={targetUser}
          isFollowDialogOpen={isFollowDialogOpen}
          setIsFollowDialogOpen={setIsFollowDialogOpen}
        />
      )}
    </>
  )
}

interface DialogProps {
  targetUser: IUser
  isFollowDialogOpen: boolean
  setIsFollowDialogOpen: Dispatch<SetStateAction<boolean>>
}

const FollowingDialog = ({ targetUser, isFollowDialogOpen, setIsFollowDialogOpen }: DialogProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [following, setFollowing] = useState<IFollowUser[]>([])

  useEffect(() => {
    const fetchFollowing = async () => {
      const following = await userService.getFollowing<IFollowUser[]>(targetUser?.id)
      setFollowing(following)
    }

    fetchFollowing()
  }, [targetUser])

  return (
    <>
      {isMobile ? (
        <Drawer open={isFollowDialogOpen} onOpenChange={setIsFollowDialogOpen} direction="right">
          <DrawerContent className="w-screen! h-screen max-w-none rounded-none">
            <div className="w-full flex justify-center items-center">
              <DrawerClose className="absolute left-6">
                <ChevronLeft />
              </DrawerClose>
              <DrawerTitle className="my-5 text-sm">Following</DrawerTitle>
              <DrawerDescription className="sr-only">See who this user is following</DrawerDescription>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {following.length > 0 ? (
                following.map((follower) => (
                  <FollowUserCard user={follower} setIsFollowDialogOpen={setIsFollowDialogOpen} />
                ))
              ) : (
                <p>This user is not following anyone yet.</p>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFollowDialogOpen} onOpenChange={setIsFollowDialogOpen}>
          <DialogContent className="sm:max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <DialogHeader className="items-center">
                <DialogTitle className="my-2 text-sm">Following</DialogTitle>
              </DialogHeader>
            </div>
            <div className="overflow-y-auto max-h-[60vh] px-1 py-2">
              {following.length > 0 ? (
                following.map((follower) => (
                  <FollowUserCard user={follower} setIsFollowDialogOpen={setIsFollowDialogOpen} />
                ))
              ) : (
                <p>This user is not following anyone yet.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

const FollowerDialog = ({ targetUser, isFollowDialogOpen, setIsFollowDialogOpen }: DialogProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [followers, setFollowers] = useState<IFollowUser[]>([])

  useEffect(() => {
    const fetchFollowers = async () => {
      const followers = await userService.getFollowers<IFollowUser[]>(targetUser?.id)
      setFollowers(followers)
    }

    fetchFollowers()
  }, [targetUser])

  return (
    <>
      {isMobile ? (
        <Drawer open={isFollowDialogOpen} onOpenChange={setIsFollowDialogOpen} direction="right">
          <DrawerContent className="w-screen! h-screen max-w-none rounded-none">
            <div className="w-full flex justify-center items-center">
              <DrawerClose className="absolute left-6">
                <ChevronLeft />
              </DrawerClose>
              <DrawerTitle className="my-5 text-sm">Followers</DrawerTitle>
              <DrawerDescription className="sr-only">See who follows you</DrawerDescription>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <FollowUserCard user={follower} setIsFollowDialogOpen={setIsFollowDialogOpen} />
                ))
              ) : (
                <p>No followers found.</p>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFollowDialogOpen} onOpenChange={setIsFollowDialogOpen}>
          <DialogContent className="sm:max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <DialogHeader className="items-center">
                <DialogTitle className="my-2 text-sm">Followers</DialogTitle>
              </DialogHeader>
            </div>
            <div className="overflow-y-auto max-h-[60vh] px-1 py-2">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <FollowUserCard user={follower} setIsFollowDialogOpen={setIsFollowDialogOpen} />
                ))
              ) : (
                <p>No followers found.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

const FollowUserCard = ({
  user,
  setIsFollowDialogOpen,
}: {
  user: IFollowUser
  setIsFollowDialogOpen: (open: boolean) => void
}) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const { currentUser } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFollowState = async () => {
      const followState = await userService.getFollowState<{ is_following: boolean }>(user.user_id)
      setIsFollowing(followState.is_following)
    }
    fetchFollowState()
  }, [user.user_id])

  const handleFollowToggle = async () => {
    const userId = user?.user_id
    if (!userId) return

    try {
      if (isFollowing) {
        await userService.unfollowUser(userId)
      } else {
        await userService.followUser(userId)
      }
      setIsFollowing((prev) => !prev)
    } catch (error) {
      console.error(error)
      toast.error(isFollowing ? "Could not unfollow user" : "Could not follow user")
    }
  }

  return (
    <div
      className="flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-secondary/15"
      onClick={() => {
        navigate(`/${user.username}`)
        setIsFollowDialogOpen(false)
      }}
    >
      <img src={user.profile_picture.url} alt={`${user.username}'s avatar`} className="w-10 h-10 rounded-full" />
      <span>{user.username}</span>
      {currentUser?.id === user.user_id ? null : (
        <Button
          variant={isFollowing ? "outline" : "default"}
          className="flex ms-auto cursor-pointer"
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  )
}

export default FollowDialog
