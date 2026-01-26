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
        <div key={index}>
          <Post photo={post} />
          {index != posts.length - 1 ? <Separator className="my-6" /> : null}
        </div>
      ))}
    </div>
  )
}

export default FeedPage
