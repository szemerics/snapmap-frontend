import type { IPhoto } from "@/interfaces/IPhoto"
import DefaultPfp from "@/assets/default-pfp.svg"
import { Avatar, AvatarImage } from "../ui/avatar"

type PostsProps = {
  photo: IPhoto
}

const Post = ({ photo }: PostsProps) => {
  return (
    <div className="">
      <div className="">
        <Avatar>
          <AvatarImage src={DefaultPfp}></AvatarImage>
        </Avatar>
      </div>
      <div className="">
        <img src={photo.photo_url} alt="" />
      </div>
    </div>
  )
}

export default Post
