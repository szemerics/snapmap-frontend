import { Menu, Cog, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"
import ProfileSettings from "./ProfileSettings"
import type { IUser } from "@/interfaces/IUser"
import { authService } from "@/services/auth.service"
import { useAuthContext } from "@/context/AuthContext"

type ProfileMenuProps = {
  targetUser: IUser
}

const ProfileMenu = ({ targetUser }: ProfileMenuProps) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { setAccessToken, setCurrentUser, currentUser } = useAuthContext()
  const navigate = useNavigate()

  const isOwnProfile = useMemo(() => currentUser?.id === targetUser.id, [currentUser?.id, targetUser.id])

  const handleLogout = async () => {
    setAccessToken(null)
    setCurrentUser(null)
    await authService.logout()
    navigate("/login")
  }

  if (!isOwnProfile) {
    return null
  }

  return (
    <>
      <div className="fixed top-4 right-2">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} className="cursor-pointer size-10">
              <Menu className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="end">
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                setIsSettingsDialogOpen(true)
                setIsDropdownOpen(false)
              }}
            >
              <Cog className="mr-1" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                setIsLogoutDialogOpen(true)
                setIsDropdownOpen(false)
              }}
            >
              <LogOut className="mr-1 text-destructive" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} variant="destructive">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isSettingsDialogOpen && (
        <ProfileSettings
          isSettingsDialogOpen={isSettingsDialogOpen}
          setIsSettingsDialogOpen={setIsSettingsDialogOpen}
          targetUser={targetUser}
        />
      )}
    </>
  )
}

export default ProfileMenu
