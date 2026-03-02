import Post from "@/components/post/Post"
import { Separator } from "@/components/ui/separator"
import type { IPhoto } from "@/interfaces/IPhoto"
import { useEffect, useState } from "react"
import { photoService } from "@/services/photo.service"
import { Skeleton } from "@/components/ui/skeleton"

const FeedSkeleton = () => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center justify-between px-4">
      <div className="flex gap-2 items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="w-full h-[360px]" />
    <div className="px-4 space-y-3">
      <div className="flex gap-3 items-center">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="flex gap-2 items-center">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="ms-auto flex gap-2 items-center">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
)

const FeedPage = () => {
  const [posts, setPosts] = useState<IPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await photoService.getPhotos<IPhoto[]>()
        setPosts(data)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="my-6 space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <FeedSkeleton />
            {index !== 2 ? <Separator className="my-6" /> : null}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="my-6">
      {posts.map((post, index) => (
        <div key={post.id}>
          <Post
            photo={post}
            onDelete={() => {
              // Only UI update: safe as this only runs when the DELETE endpoint returns 200 OK
              // However could be improved later
              setPosts((prevPosts) => prevPosts.filter((item) => item.id !== post.id))
            }}
          />
          {index != posts.length - 1 ? <Separator className="my-6" /> : null}
        </div>
      ))}
    </div>
  )
}

export default FeedPage
