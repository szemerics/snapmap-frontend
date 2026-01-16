import { Avatar, AvatarImage } from "../ui/avatar"
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent } from "../ui/dialog"
import type { IPhoto } from "@/interfaces/IPhoto"
import api from "@/api/api"
import { Badge } from "../ui/badge"
import { ChevronLeft, Heart, MessageCircle } from "lucide-react"
import { Separator } from "../ui/separator"

type PostsProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedIndex: number
}

const Posts = ({ isOpen, setIsOpen, selectedIndex }: PostsProps) => {
  const [posts, setPosts] = useState<IPhoto[]>([])
  const postRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    async function fetchPosts() {
      const data = await api.Photo.getUserPhotos().then((res) => res.data)
      setPosts(data)
      setImagesLoaded(false)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    if (isOpen && posts.length > 0 && selectedIndex >= 0 && selectedIndex < posts.length && imagesLoaded) {
      requestAnimationFrame(() => {
        const selectedPost = postRef.current?.[selectedIndex]
        const container = containerRef.current

        if (selectedPost && container) {
          const postTop = selectedPost.offsetTop
          const postHeight = selectedPost.clientHeight
          const containerHeight = container.clientHeight

          const scrollPosition = postTop - containerHeight / 2 + postHeight / 2
          container.scrollTo({
            top: scrollPosition,
            behavior: "instant",
          })
        }
      })
    }
  }, [isOpen, posts, selectedIndex, imagesLoaded])

  const Post = ({ user_summary, photo_url, category, caption, likes, index, comments }: IPhoto & { index: number }) => {
    const handleImageLoad = () => {
      if (index === selectedIndex) {
        setImagesLoaded(true)
      }
    }

    return (
      <div
        ref={(element) => {
          postRef.current[index] = element
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
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
        <img src={photo_url} alt="" className="w-full h-auto object-contain" onLoad={handleImageLoad} />
        <div className="flex gap-3">
          <div className="flex gap-1 items-center">
            <Heart size={20} /> {likes}
          </div>
          <div className="flex gap-1 items-center">
            <MessageCircle size={20} /> {Array.isArray(comments) ? comments.length : 0}
          </div>
        </div>
        <span>{caption}</span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="w-screen h-screen max-w-none m-0 p-6 sm:rounded-lg rounded-none"
        showCloseButton={false}
      >
        <div className="w-full flex justify-center items-center">
          <DialogClose className="absolute left-6">
            <ChevronLeft />
          </DialogClose>
          <span>Posts</span>
        </div>
        <div ref={containerRef} className="overflow-y-auto max-h-screen flex flex-col scrollbar-hide">
          {posts.map((post, index) => (
            <>
              <Post key={index} {...post} index={index} />
              {index != posts.length - 1 ? <Separator className="my-4" /> : null}
            </>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Posts
