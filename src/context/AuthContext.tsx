import type { IUser } from "@/interfaces/IUser"
import { userService } from "@/services/user.service"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type AuthContextType = {
  currentUser: IUser | undefined
  isAuthLoading: boolean
  updateCurrentUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser>()
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  async function fetchCurrentUser() {
    try {
      const user = await userService.getMyUser<IUser>()
      setCurrentUser(user)
    } catch (error) {
      console.error("Failed to fetch current user:", error)
      setCurrentUser(undefined)
    } finally {
      setIsAuthLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, isAuthLoading, updateCurrentUser: fetchCurrentUser }}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error("useAuthContext must be used within provider")
  }

  return authContext
}
