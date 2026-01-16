import { MapPin, GalleryVerticalEnd, UserCircle, SearchIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "@/api/api"

const Navbar = () => {
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await api.User.getCurrentUser().then((res) => res.data)
      setUsername(user.username)
    }
    fetchCurrentUser()
  }, [])

  return (
    <Card className="w-full sm:max-w-sm sm:mx-auto sm:rounded-lg rounded-none fixed bottom-0 left-0 right-0 z-50">
      <CardContent className="flex px-12 py-2 justify-between items-center">
        <SearchIcon />
        <Link to={"/"} className="cursor-pointer">
          <GalleryVerticalEnd />
        </Link>
        <MapPin />
        <Link to={`/${username}`} className="cursor-pointer">
          <UserCircle />
        </Link>
      </CardContent>
    </Card>
  )
}

export default Navbar
