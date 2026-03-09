import type { IPhoto, IUserSummary } from "@/interfaces/IPhoto"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import {
  Heart,
  MessageCircle,
  EllipsisVertical,
  Trash2,
  Pencil,
  Camera,
  Tag,
  Settings2,
  MapPin,
  Calendar,
  Trash2Icon,
} from "lucide-react"
import { forwardRef, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { photoService } from "@/services/photo.service"
import type { IUser } from "@/interfaces/IUser"
import { useAuthContext } from "@/context/AuthContext"
import { toast } from "sonner"
import { format } from "date-fns"
import { formatDate } from "./helpers"
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogMedia,
} from "../ui/alert-dialog"

type PostProps = {
  photo: IPhoto
  onImageLoad?: () => void
  targetUser?: IUser
  onDelete?: () => void
  showMapView?: boolean
}

const Post = forwardRef<HTMLDivElement, PostProps>(
  ({ photo, onImageLoad, targetUser, onDelete, showMapView = true }, ref) => {
    const [showMoreIcon, setShowMoreIcon] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const { currentUser } = useAuthContext()
    const navigate = useNavigate()

    const [isLiked, setIsLiked] = useState(
      photo.likes.some((userSummary: IUserSummary) => userSummary.username === currentUser?.username)
    )
    const [likesCount, setLikesCount] = useState(photo.likes.length)

    const handleImageDelete = async (photoId: string) => {
      try {
        await toast.promise(photoService.deletePhoto<string>(photoId), {
          position: "top-center",
          loading: "Deleting image...",
          success: () => {
            onDelete?.()
            return "Image has been deleted"
          },
          error: "Error while deleting the image",
        })
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      if (targetUser?.id === currentUser?.id || currentUser?.role === "admin") {
        setShowMoreIcon(true)
      }
    }, [targetUser, currentUser])

    const GearDropdown = (photo: IPhoto) =>
      photo.gear?.camera ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge variant={"secondary"} className="capitalize cursor-pointer">
              <Camera />
              {photo.gear.camera.brand} {photo.gear.camera.model}
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Gear</DropdownMenuLabel>
              {photo.gear.camera.brand && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  Brand: <span className="capitalize">{photo.gear.camera.brand}</span>
                </DropdownMenuItem>
              )}
              {photo.gear.camera.model && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  Model: <span className="capitalize">{photo.gear.camera.model}</span>
                </DropdownMenuItem>
              )}
              {photo.gear.camera.type && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  Type: <span className="capitalize">{photo.gear.camera.type}</span>
                </DropdownMenuItem>
              )}
              {photo.gear.lens && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  Lens: <span className="capitalize">{photo.gear.lens}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null

    const SettingsDropdown = (photo: IPhoto) =>
      photo.settings_used ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Badge variant={"secondary"} className="capitalize cursor-pointer">
              <Settings2 />
              View Settings
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              {photo.settings_used.iso && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  ISO: <span className="capitalize">{photo.settings_used.iso}</span>
                </DropdownMenuItem>
              )}
              {photo.settings_used.shutter_speed && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  Shutter Speed: <span className="capitalize">{photo.settings_used.shutter_speed}</span>
                </DropdownMenuItem>
              )}
              {photo.settings_used.aperture && (
                <DropdownMenuItem className="text-xs pointer-events-none">
                  Aperture: <span className="capitalize">{photo.settings_used.aperture}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null

    useEffect(() => {
      setIsLiked(photo.likes.some((userSummary) => userSummary.username === currentUser?.username))
      setLikesCount(photo.likes.length)
    }, [photo, currentUser?.username])

    const handleMapView = () => {
      if (!photo.location) return

      const { lat, lng } = photo.location
      navigate(`/map?lat=${lat}&lng=${lng}&photoId=${photo.id}`)
    }

    const handleLike = async () => {
      if (!currentUser) return

      const previousIsLiked = isLiked
      const previousLikesCount = likesCount

      if (previousIsLiked) {
        setIsLiked(false)
        setLikesCount((count) => count - 1)
        try {
          await photoService.unlikePhoto(photo.id)
        } catch (error) {
          setIsLiked(previousIsLiked)
          setLikesCount(previousLikesCount)
        }
      } else {
        setIsLiked(true)
        setLikesCount((count) => count + 1)
        try {
          await photoService.likePhoto(photo.id)
        } catch (error) {
          setIsLiked(previousIsLiked)
          setLikesCount(previousLikesCount)
        }
      }
    }

    return (
      <>
        <div ref={ref} className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-4">
            <Link to={`/${photo.user_summary.username}`} className=" flex gap-2 items-center">
              <Avatar size="sm">
                <AvatarImage src={photo.user_summary.profile_picture.url} />
              </Avatar>
              {photo.user_summary.username}{" "}
            </Link>
            {showMoreIcon && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="ml-auto" size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Pencil className="mr-1" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                    <Trash2 className="text-destructive mr-1" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <img src={photo.photo_url} alt="" className="w-full h-auto object-contain" onLoad={onImageLoad} />
          <div className="px-4">
            <div className="flex gap-3 items-center">
              <div className="flex gap-1 items-center">
                <Heart
                  size={20}
                  className={`mb-0.5 cursor-pointer ${isLiked ? "text-destructive fill-destructive" : "text-muted-foreground"}`}
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  onClick={handleLike}
                />
                <span className="text-xs">{likesCount}</span>
              </div>
              <div className="flex gap-1 items-center">
                <MessageCircle size={20} className="mb-0.5" /> <span className="text-xs">{photo.comments.length}</span>
              </div>
              <div className="ms-auto text-xs flex gap-1 items-center">
                <Calendar size={16} className="mb-0.5" />
                {format(new Date(photo.date_captured), "PP")} at {format(new Date(photo.date_captured), "HH:mm")}
              </div>
            </div>
            <div className="flex gap-1 items-center mt-3 flex-wrap">
              <Badge variant={"secondary"} className="capitalize">
                <Tag />
                {photo.category}
              </Badge>
              {GearDropdown(photo)}
              {SettingsDropdown(photo)}
              {photo.location && showMapView && (
                <Badge variant={"secondary"} className="cursor-pointer" onClick={() => handleMapView()}>
                  <MapPin />
                  Map View
                </Badge>
              )}
            </div>
          </div>
          <span className="px-4 text-sm">{photo.caption}</span>
          <span className="px-4 text-xs text-muted-foreground">{formatDate(photo.date_posted)}</span>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete post?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete this post.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => handleImageDelete(photo.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }
)

export default Post
