import { useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import { ChevronLeft } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import type { IUser } from "@/interfaces/IUser"
import { FileUpload, FileUploadTrigger } from "../ui/file-upload"
import { Button } from "../ui/button"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { userService } from "@/services/user.service"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "@/context/AuthContext"
import { UploadIcon } from "lucide-react"

type ProfileSettingsProps = {
  isSettingsDialogOpen: boolean
  setIsSettingsDialogOpen: (open: boolean) => void
  targetUser: IUser
}

type EditProfileFormData = {
  username?: string
  bio?: string
}

const ProfileSettings = ({ isSettingsDialogOpen, setIsSettingsDialogOpen, targetUser }: ProfileSettingsProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const navigate = useNavigate()
  const { updateCurrentUser } = useAuthContext()
  const [editProfileFormData, setEditProfileFormData] = useState<EditProfileFormData>({} as EditProfileFormData)
  const [isChanged, setIsChanged] = useState(false)
  const [uploadProfilePicture, setUploadProfilePicture] = useState<File | null>(null)

  const handleEditProfile = async () => {
    const submit = async () => {
      const formData = new FormData()
      if (uploadProfilePicture) {
        formData.append("uploaded_file", uploadProfilePicture)
        await userService.updateProfilePicture(formData as any)
      }
      const hasUsernameChange = editProfileFormData.username && editProfileFormData.username !== targetUser.username
      const hasBioChange = editProfileFormData.bio && editProfileFormData.bio !== targetUser.bio

      if (hasUsernameChange || hasBioChange) {
        await userService.updateProfile({
          username: editProfileFormData.username,
          bio: editProfileFormData.bio,
        })
      }

      return "Profile updated successfully"
    }

    await toast.promise(submit, {
      position: "top-center",
      loading: "Updating profile...",
      success: async () => {
        setIsSettingsDialogOpen(false)
        await updateCurrentUser()
        navigate(`/${editProfileFormData.username ?? targetUser.username}`)

        return "Profile updated successfully"
      },
      error: "Error updating profile",
    })
  }

  const editProfileForm = useMemo(
    () => (
      <form onSubmit={handleEditProfile}>
        <FieldGroup>
          <Field>
            <FileUpload
              onUpload={(files) => {
                setUploadProfilePicture(files[0])
                setIsChanged(true)
              }}
            >
              <FileUploadTrigger className="flex flex-col sm:mx-auto items-center gap-2 text-center cursor-pointer border-2 border-dashed rounded-lg p-4 bg-card/40 hover:bg-card/60 transition-colors">
                <Avatar className="size-20">
                  <AvatarImage
                    src={
                      uploadProfilePicture ? URL.createObjectURL(uploadProfilePicture) : targetUser?.profile_picture.url
                    }
                  />
                </Avatar>
                <Button type="button" variant="outline" className="mt-2 w-fit cursor-pointer">
                  <UploadIcon className="mr-1" /> Upload New
                </Button>
              </FileUploadTrigger>
            </FileUpload>
          </Field>

          <Separator />

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              placeholder="Username"
              value={editProfileFormData.username ?? targetUser.username}
              onChange={(e) => {
                if (e.target.value !== targetUser.username) {
                  setIsChanged(true)
                } else {
                  setIsChanged(false)
                }
                setEditProfileFormData({ ...editProfileFormData, username: e.target.value })
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Bio"
              value={(editProfileFormData.bio ?? targetUser.bio) || ""}
              onChange={(e) => {
                if (e.target.value !== targetUser.bio) {
                  setIsChanged(true)
                } else {
                  setIsChanged(false)
                }
                setEditProfileFormData({ ...editProfileFormData, bio: e.target.value })
              }}
            />
          </Field>
        </FieldGroup>
      </form>
    ),
    [editProfileFormData, handleEditProfile, targetUser]
  )

  return (
    <>
      {isDesktop ? (
        <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
          <DialogContent className="sm:max-w-md w-full">
            <div className="w-full flex justify-center items-center">
              <DialogHeader className="items-center">
                <DialogTitle className="my-2 text-sm">Settings</DialogTitle>
              </DialogHeader>
            </div>
            <div className="overflow-y-auto max-h-[60vh] px-1 py-2">{editProfileForm}</div>
            <Button
              variant={isChanged ? "default" : "outline"}
              className="mt-3 w-full"
              disabled={!isChanged}
              onClick={(e) => {
                e.preventDefault()
                handleEditProfile()
              }}
            >
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen} direction="right">
          <DrawerContent className="w-screen! h-screen max-w-none rounded-none">
            <div className="w-full flex justify-center items-center">
              <DrawerClose className="absolute left-6">
                <ChevronLeft />
              </DrawerClose>
              <DrawerTitle className="my-5 text-sm">Settings</DrawerTitle>
              <DrawerDescription className="sr-only">Edit profile settings and gear</DrawerDescription>
            </div>
            <div className="overflow-y-auto flex-1 px-6 py-4">{editProfileForm}</div>
            <Button
              variant={isChanged ? "default" : "outline"}
              className="mx-6 mb-6"
              disabled={!isChanged}
              onClick={(e) => {
                e.preventDefault()
                handleEditProfile()
              }}
            >
              Save Changes
            </Button>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

export default ProfileSettings
