import api from "@/api/api"
import Post from "@/components/Post"
import { Separator } from "@/components/ui/separator"
import type { IPhoto } from "@/interfaces/IPhoto"
import { useEffect, useState } from "react"

const FeedPage = () => {
  const [posts, setPosts] = useState<IPhoto[]>([])

  useEffect(() => {
    async function fetchPosts() {
      const data: IPhoto[] = await api.Photo.getAllPhotos().then((res) => res.data)
      setPosts(data)
    }
    fetchPosts()
  }, [])

  return (
    <div className="mt-16">
      {posts.map((post, index) => (
        <div>
          <Post {...post} />
          {index != posts.length - 1 ? <Separator className="my-4 w-9/10! mx-auto" /> : null}
        </div>
      ))}
    </div>
  )
}

export default FeedPage
