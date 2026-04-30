import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { Link, useNavigate } from "react-router"
import { authService } from "@/services/auth.service"
import { toast } from "sonner"
import { useAuthContext } from "@/context/AuthContext"
import type { IUser } from "@/interfaces/IUser"

const RegisterForm = () => {
  const navigate = useNavigate()
  const { setAccessToken, setCurrentUser } = useAuthContext()
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (registerForm.password !== registerForm.confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return
    }

    setConfirmPasswordError("")

    await toast.promise(authService.register<{ access_token: string, user: IUser }>(registerForm), {
      position: "top-center",
      loading: "Registering...",
      success: (response) => {
        setAccessToken(response.access_token)
        setCurrentUser(response.user)
        navigate("/login")
        return "Registration successful! Please log in."
      },
      error: "An error occurred. Please try again.",
    })
  }

  
  return (
    <div className={`flex flex-col gap-6`}>
      <Card>
        <CardHeader>
          <CardTitle>Register account</CardTitle>
          <CardDescription>Enter your information below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="professionalphotographer67"
                  required
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
                <FieldDescription>We will not share your email with anyone else.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
                  <FieldError>{confirmPasswordError}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  />
                  <FieldError>{confirmPasswordError}</FieldError>
                <FieldDescription>Please confirm your password.</FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Sign In</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterForm
