import { MapPin, GalleryVerticalEnd, UserCircle, SearchIcon, ImagePlus } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Link, useLocation } from "react-router-dom"
import { useUploadPhotoContext } from "@/context/UploadPhotoContext"
import { useAuthContext } from "@/context/AuthContext"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "./ui/button"
import TextLogo from "@/assets/snapmap-logos/text-logo.svg"
import MarkerLogo from "@/assets/snapmap-logos/marker-logo.svg"
import { Separator } from "./ui/separator"

interface NavbarProps {
  variant?: "mobile" | "desktop"
}

const Navbar = ({ variant }: NavbarProps) => {
  const { openUploadPhotoModal } = useUploadPhotoContext()
  const { currentUser } = useAuthContext()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { pathname } = useLocation()
  const isFeedPage = pathname === "/"
  const isMapPage = pathname === "/map"
  const isProfilePage = pathname.startsWith(`/${currentUser?.username}`)

  const shouldRenderMobile = variant ? variant === "mobile" : isMobile

  return (
    <>
      {shouldRenderMobile ? (
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
      ) : (
        <Card className="h-full w-full rounded-none">
          <CardContent>
            <div className="flex gap-1 mb-4">
              <img src={MarkerLogo} alt="Map" width={40} height={40} />
              <img src={TextLogo} alt="SnapMap" width={128} height={128} />
            </div>

            <Separator className="my-4" />

            <Button
              variant={"outline"}
              className="w-full justify-start cursor-pointer font-normal py-5 mb-4"
              onClick={openUploadPhotoModal}
            >
              <ImagePlus /> Upload Photo
            </Button>

            <Link to={"/"}>
              <Button
                variant={isFeedPage ? "secondary" : "ghost"}
                className="w-full justify-start cursor-pointer font-normal py-5"
              >
                <GalleryVerticalEnd /> Feed
              </Button>
            </Link>
            <Link to={"/map"}>
              <Button
                variant={isMapPage ? "secondary" : "ghost"}
                className="w-full justify-start cursor-pointer font-normal py-5"
              >
                <MapPin /> Map View
              </Button>
            </Link>
            <Link to={`/${currentUser?.username}`}>
              <Button
                variant={isProfilePage ? "secondary" : "ghost"}
                className="w-full justify-start cursor-pointer font-normal py-5"
              >
                <UserCircle /> Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default Navbar
