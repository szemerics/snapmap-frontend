import type { IUser } from "@/interfaces/IUser"
import { userService } from "@/services/user.service"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type AuthContextType = {
  currentUser: IUser | undefined
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser>()

  useEffect(() => {
    async function fetchCurrentUser() {
      const user = await userService.getMyUser<IUser>()
      setCurrentUser(user)
    }
    fetchCurrentUser()
  }, [])

  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error("useAuthContext must be used within provider")
  }

  return authContext
}
