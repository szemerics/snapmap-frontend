import type { IPhoto } from "@/interfaces/IPhoto"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Heart, MessageCircle, EllipsisVertical, Trash2, Pencil } from "lucide-react"
import { forwardRef, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { photoService } from "@/services/photo.service"
import type { IUser } from "@/interfaces/IUser"
import { useAuthContext } from "@/context/AuthContext"

type PostProps = {
  photo: IPhoto
  onImageLoad?: () => void
  targetUser?: IUser
}

const handleImageDelete = async (photo_id: string) => {
  try {
    await photoService.deletePhoto<string>({ photo_id })
  } catch (error) {
    console.log(error)
  }
}

const Post = forwardRef<HTMLDivElement, PostProps>(({ photo, onImageLoad, targetUser }, ref) => {
  const [showMoreIcon, setShowMoreIcon] = useState(false)
  const { currentUser } = useAuthContext()

  useEffect(() => {
    if (targetUser?.id === currentUser?.id || currentUser?.role === "admin") {
      setShowMoreIcon(true)
    }
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-4">
        <Link to={`/${photo.user_summary.username}`} className=" flex gap-2 items-center">
          <Avatar size="sm">
            <AvatarImage src={photo.user_summary.profile_picture_url} />
          </Avatar>
          {photo.user_summary.username}
        </Link>
        {showMoreIcon && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="ml-auto" size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil className="mr-1" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImageDelete(photo.id)}>
                <Trash2 className="text-destructive mr-1" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <img src={photo.photo_url} alt="" className="w-full h-auto object-contain" onLoad={onImageLoad} />
      <div className="flex gap-3 px-4">
        <div className="flex gap-1 items-center">
          <Heart size={20} className="mb-0.5" /> <span className="text-xs">{photo.likes}</span>
        </div>
        <div className="flex gap-1 items-center">
          <MessageCircle size={20} className="mb-0.5" />{" "}
          <span className="text-xs">{Array.isArray(photo.comments) ? photo.comments.length : 0}</span>
        </div>
        <Badge variant={"secondary"} className="capitalize ml-auto">
          {photo.category}
        </Badge>
      </div>
      <span className="px-4 text-sm">{photo.caption}</span>
    </div>
  )
})

export default Post
