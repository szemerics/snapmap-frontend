import Post from "@/components/post/Post"
import { Separator } from "@/components/ui/separator"
import type { IPhoto } from "@/interfaces/IPhoto"
import { useEffect, useState } from "react"
import { photoService } from "@/services/photo.service"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/AuthContext"

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
  const [activeTab, setActiveTab] = useState<"feed" | "following">("feed")
  const { currentUser } = useAuthContext()

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)
      try {
        const data =
          activeTab === "following"
            ? await photoService.getFollowingPhotos<IPhoto[]>()
            : await photoService.getPhotos<IPhoto[]>()

        const filteredData = data.filter((photo) => photo.user_summary.user_id !== currentUser?.id) ?? data
        setPosts(filteredData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [activeTab])

  if (isLoading) {
    return (
      <div className="my-6 space-y-6">
        <FeedTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <FeedSkeleton />
              {index !== 2 ? <Separator className="my-6" /> : null}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="my-6">
      <FeedTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

      {posts.length === 0 && activeTab === "following" && (
        <p className="text-muted-foreground text-sm px-4">No posts yet from users you follow.</p>
      )}
      <div className="mt-16">
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
    </div>
  )
}

interface FeedTabButtonsProps {
  activeTab: "feed" | "following"
  setActiveTab: (tab: "feed" | "following") => void
}

const FeedTabButtons = ({ activeTab, setActiveTab }: FeedTabButtonsProps) => {
  return (
    <div className="px-4 mb-4">
      <div className="flex items-center gap-2 justify-center fixed w-full bg-background z-10 top-0 left-0 right-0 h-16">
        <Button
          type="button"
          size="lg"
          variant={activeTab === "feed" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("feed")}
          className={`cursor-pointer ${activeTab === "feed" ? "font-medium" : "font-light"}`}
        >
          Feed
        </Button>
        <Button
          type="button"
          size="lg"
          variant={activeTab === "following" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("following")}
          className={`cursor-pointer ${activeTab === "following" ? "font-medium" : "font-light"}`}
        >
          Following
        </Button>
      </div>
    </div>
  )
}

export default FeedPage
