import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import api from "@/api/api"
import { Link, useNavigate } from "react-router"

const LoginForm = () => {
  const navigate = useNavigate()
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.Auth.login(loginForm.email, loginForm.password)
      const { access_token } = response.data

      localStorage.setItem("access_token", access_token)

      navigate("/")
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Invalid email or password")
      } else {
        alert("An error occurred. Please try again.")
      }
    }
  }

  if (localStorage.getItem("access_token")) {
    navigate("/")
    return null
  }

  return (
    <div className={`flex flex-col gap-6`}>
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
