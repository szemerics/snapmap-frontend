import type { IPhoto } from "@/interfaces/IPhoto"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import { forwardRef } from "react"

interface PostProps extends IPhoto {
  onImageLoad?: () => void
}

const Post = forwardRef<HTMLDivElement, PostProps>(
  ({ user_summary, photo_url, category, caption, likes, comments, onImageLoad }, ref) => {
    return (
      <div ref={ref} className="flex flex-col gap-3 no-scrollbar">
        <div className="flex items-center justify-between mx-4">
          <div className=" flex gap-2 items-center">
            <Avatar size="sm">
              <AvatarImage src={user_summary.profile_picture_url} />
            </Avatar>
            {user_summary.username}
          </div>
          <Badge variant={"secondary"} className="capitalize">
            {category}
          </Badge>
        </div>
        <img src={photo_url} alt="" className="w-full h-auto object-contain" onLoad={onImageLoad} />
        <div className="flex gap-3 mx-4">
          <div className="flex gap-1 items-center">
            <Heart size={20} /> {likes}
          </div>
          <div className="flex gap-1 items-center">
            <MessageCircle size={20} /> {Array.isArray(comments) ? comments.length : 0}
          </div>
        </div>
        <span className="mx-4">{caption}</span>
      </div>
    )
  }
)

Post.displayName = "Post"

export default Post
