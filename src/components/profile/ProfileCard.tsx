import { Card, CardContent, CardHeader } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar"
import DefaultPfp from "@/assets/default-pfp.svg"
import type { IUser } from "@/interfaces/IUser"

type ProfileCardProps = {
  user: IUser
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const header = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex justify-center items-center w-full gap-4">
          <div className="flex flex-col w-full text-right">
            <span>156</span>
            <span className="text-muted-foreground text-xs">Followers</span>
          </div>
          <Avatar size="lg">
            <AvatarImage src={user.profile_picture_url ?? DefaultPfp}></AvatarImage>
          </Avatar>
          <div className="flex flex-col w-full">
            <span>543</span>
            <span className="text-muted-foreground text-xs">Likes</span>
          </div>
        </div>
        <h2 className="">{user.username}</h2>
      </div>
    )
  }

  return (
    <>
      <Card className="w-full sm:max-w-sm sm:mx-auto flex gap-1 sm:rounded-xl rounded-none">
        <CardHeader>{header()}</CardHeader>
        <CardContent className="text-muted-foreground text-center text-xs">{user.bio}</CardContent>
      </Card>
    </>
  )
}

export default ProfileCard
