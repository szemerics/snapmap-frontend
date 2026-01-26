import { useEffect, useRef, useState } from "react"
import { Dialog, DialogClose, DialogContent } from "../ui/dialog"
import type { IPhoto } from "@/interfaces/IPhoto"
import { ChevronLeft } from "lucide-react"
import { Separator } from "../ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerClose, DrawerContent } from "../ui/drawer"
import Post from "../Post"
import { photoService } from "@/services/photo.service"

type ProfilePostsProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedIndex: number
  username: string
}

const ProfilePosts = ({ isOpen, setIsOpen, selectedIndex, username }: ProfilePostsProps) => {
  const [posts, setPosts] = useState<IPhoto[]>([])
  const postRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    async function fetchPosts() {
      const data = await photoService.getPhotos<IPhoto[]>({ username })
      setPosts(data)
      setImagesLoaded(false)
    }
    fetchPosts()
  }, [username])

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

  const BuildPost = () => (
    <>
      {posts.map((post, index) => (
        <div key={index}>
          <Post
            photo={post}
            onImageLoad={() => {
              if (index === selectedIndex) {
                setImagesLoaded(true)
              }
            }}
            ref={(element) => {
              postRef.current[index] = element
            }}
          />
          {index != posts.length - 1 ? <Separator className="my-6" /> : null}
        </div>
      ))}
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="w-screen h-screen max-w-none m-0 p-6 sm:rounded-lg rounded-none"
          showCloseButton={false}
        >
          <div className="w-full flex justify-center items-center">
            <DialogClose className="absolute left-6 cursor-pointer">
              <ChevronLeft />
            </DialogClose>
            <span>Posts</span>
          </div>
          <div ref={containerRef} className="overflow-y-auto max-h-screen flex flex-col no-scrollbar">
            <BuildPost />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerContent className="w-screen! h-screen max-w-none rounded-none">
        <div className="w-full flex justify-center items-center">
          <DrawerClose className="absolute left-6">
            <ChevronLeft />
          </DrawerClose>
          <span className="my-5">Posts</span>
        </div>
        <div ref={containerRef} className="overflow-y-auto max-h-screen flex flex-col no-scrollbar pb-5">
          <BuildPost />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default ProfilePosts
