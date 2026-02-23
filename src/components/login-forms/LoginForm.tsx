import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Link, useNavigate } from "react-router"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"

const LoginForm = () => {
  const navigate = useNavigate()
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await toast.promise(authService.login<{ access_token: string }>(loginForm), {
      position: "top-center",
      loading: "Logging in...",
      success: (response) => {
        localStorage.setItem("access_token", response.access_token)
        navigate("/")
        return "Logged in successfully"
      },
      error: "Invalid email or password",
    })
  }

  if (localStorage.getItem("access_token")) {
    navigate("/")
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/register">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
