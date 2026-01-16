import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
// import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = !!localStorage.getItem("access_token")

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
])

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="snapmap-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
