import type { IUser } from "@/interfaces/IUser"
import { userService } from "@/services/user.service"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type AuthContextType = {
  currentUser: IUser | undefined
  updateCurrentUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser>()

  async function fetchCurrentUser() {
    const user = await userService.getMyUser<IUser>()
    setCurrentUser(user)
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, updateCurrentUser: fetchCurrentUser }}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error("useAuthContext must be used within provider")
  }

  return authContext
}
