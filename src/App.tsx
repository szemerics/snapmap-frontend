import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import Navbar from "./components/Navbar"
import FeedPage from "./pages/FeedPage"
import MapPage from "./pages/MapPage"
import { UploadPhotoProvider } from "./context/UploadPhotoContext"
import UploadPhotoModal from "./components/UploadPhotoModal"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem("access_token")

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <div className="pb-18 w-full sm:max-w-sm sm:mx-auto sm:rounded-lg rounded-none">{children}</div>
      <Navbar />
    </>
  )
}

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
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
])

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="snapmap-ui-theme">
      <UploadPhotoProvider>
        <RouterProvider router={router} />
        <UploadPhotoModal />
      </UploadPhotoProvider>
    </ThemeProvider>
  )
}

export default App
