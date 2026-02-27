import { MapPin, GalleryVerticalEnd, UserCircle, SearchIcon, ImagePlus } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Link } from "react-router-dom"
import { useUploadPhotoContext } from "@/context/UploadPhotoContext"
import { useAuthContext } from "@/context/AuthContext"

const Navbar = () => {
  const { openUploadPhotoModal } = useUploadPhotoContext()
  const { currentUser } = useAuthContext()

  return (
    <Card className="w-full sm:max-w-sm sm:mx-auto rounded-none fixed bottom-0 left-0 right-0 z-50">
      <CardContent className="flex px-12 py-2 justify-between items-center">
        <SearchIcon />
        <Link to={"/"} className="cursor-pointer">
          <GalleryVerticalEnd />
        </Link>
        <ImagePlus className="cursor-pointer" onClick={openUploadPhotoModal} />
        <Link to={"/map"} className="cursor-pointer">
          <MapPin />
        </Link>
        <Link to={`/${currentUser?.username}`} className="cursor-pointer">
          <UserCircle />
        </Link>
      </CardContent>
    </Card>
  )
}

export default Navbar
