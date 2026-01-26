import { MapPin, GalleryVerticalEnd, UserCircle, SearchIcon } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { userService } from "@/services/user.service"
import type { IUser } from "@/interfaces/IUser"

const Navbar = () => {
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await userService.getMyUser<IUser>()
      setUsername(user.username)
    }
    fetchCurrentUser()
  }, [])

  return (
    <Card className="w-full sm:max-w-sm sm:mx-auto rounded-none fixed bottom-0 left-0 right-0 z-50">
      <CardContent className="flex px-12 py-2 justify-between items-center">
        <SearchIcon />
        <Link to={"/"} className="cursor-pointer">
          <GalleryVerticalEnd />
        </Link>
        <Link to={"/map"} className="cursor-pointer">
          <MapPin />
        </Link>
        <Link to={`/${username}`} className="cursor-pointer">
          <UserCircle />
        </Link>
      </CardContent>
    </Card>
  )
}

export default Navbar
