import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import FeedPage from "./pages/FeedPage"
import MapPage from "./pages/MapPage"
import SearchPage from "./pages/SearchPage"
import { UploadPhotoProvider } from "./context/UploadPhotoContext"
import UploadPhotoModal from "./components/upload-photo-modal/UploadPhotoModal"
import { AuthProvider, useAuthContext } from "./context/AuthContext"
import { Toaster } from "@/components/ui/sonner"
import ProtectedLayout from "./components/ProtectedLayout"
import NotFoundPage from "./pages/NotFoundPage"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { pathname } = useLocation()
  const { isAuthLoading } = useAuthContext()
  const isAuthenticated = !!localStorage.getItem("access_token")
  const isMapPage = pathname === "/map"

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isAuthLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <ProtectedLayout>
      {/* for now, later should make it more responsive */}
      {isMapPage ? (
        children
      ) : (
        <div className="w-full sm:max-w-sm sm:mx-auto sm:rounded-lg rounded-none">{children}</div>
      )}
    </ProtectedLayout>
  )
}

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="snapmap-ui-theme">
      <AuthProvider>
        <UploadPhotoProvider>
          <AppRouter />
          <Toaster />
          <UploadPhotoModal />
        </UploadPhotoProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <FeedPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/:username",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/map",
      element: (
        <ProtectedRoute>
          <MapPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: (
        <ProtectedRoute>
          <NotFoundPage />
        </ProtectedRoute>
      ),
    },
    { path: "/login", element: <AuthPage mode="login" /> },
    { path: "/register", element: <AuthPage mode="register" /> },
  ])

  return <RouterProvider router={router} />
}

export default App
