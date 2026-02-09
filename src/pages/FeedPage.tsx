import Post from "@/components/Post"
import { Separator } from "@/components/ui/separator"
import type { IPhoto } from "@/interfaces/IPhoto"
import { useEffect, useState } from "react"
import { photoService } from "@/services/photo.service"

const FeedPage = () => {
  const [posts, setPosts] = useState<IPhoto[]>([])

  useEffect(() => {
    async function fetchPosts() {
      const data = await photoService.getPhotos<IPhoto[]>()
      setPosts(data)
    }
    fetchPosts()
  }, [])

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
