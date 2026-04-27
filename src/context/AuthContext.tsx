import type { IUser } from "@/interfaces/IUser"
import { authService } from "@/services/auth.service"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { setStoredAccessToken } from '@/lib/auth-token';

type AuthContextType = {
  currentUser: IUser | null
  setCurrentUser: (user: IUser | null) => void
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  isAuthLoading: boolean
  // updateCurrentUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { access_token: newToken, user } = await authService.refresh<{ access_token: string; user: IUser }>()
        setAccessToken(newToken)
        setCurrentUser(user)
        setStoredAccessToken(newToken)
      } catch (e) {
        console.error("refresh failed", e)
        setCurrentUser(null)
        setAccessToken(null)
        setStoredAccessToken(null)
      } finally {
        setIsAuthLoading(false)
      }
    }
    loadAuth()
  }, [])


  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);


  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, currentUser, setCurrentUser, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error("useAuthContext must be used within provider")
  }

  return authContext
}
