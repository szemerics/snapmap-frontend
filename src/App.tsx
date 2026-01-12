import LoginForm from "./components/login-form/login-form"
import { ThemeProvider } from "./components/theme/theme-provider"

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="snapmap-ui-theme">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
