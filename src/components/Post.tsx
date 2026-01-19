import type { IPhoto } from "@/interfaces/IPhoto"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import { forwardRef } from "react"
import { Link } from "react-router-dom"

type PostProps = {
  photo: IPhoto
  onImageLoad?: () => void
}

const Post = forwardRef<HTMLDivElement, PostProps>(({ photo, onImageLoad }, ref) => {
  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-4">
        <div className=" flex gap-2 items-center">
          <Avatar size="sm">
            <AvatarImage src={photo.user_summary.profile_picture_url} />
          </Avatar>
          <Link to={`/${photo.user_summary.username}`}>{photo.user_summary.username}</Link>
        </div>
        <Badge variant={"secondary"} className="capitalize">
          {photo.category}
        </Badge>
      </div>
      <img src={photo.photo_url} alt="" className="w-full h-auto object-contain" onLoad={onImageLoad} />
      <div className="flex gap-3 px-4">
        <div className="flex gap-1 items-center">
          <Heart size={20} /> {photo.likes}
        </div>
        <div className="flex gap-1 items-center">
          <MessageCircle size={20} /> {Array.isArray(photo.comments) ? photo.comments.length : 0}
        </div>
      </div>
      <span className="px-4">{photo.caption}</span>
    </div>
  )
})

export default Post
