import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme/theme-provider"
// import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage"

const router = createBrowserRouter([
  { path: "/", element: <ProfilePage /> },
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
