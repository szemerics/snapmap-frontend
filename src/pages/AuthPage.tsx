import LoginForm from "@/components/login-forms/login-form"
import RegisterForm from "@/components/login-forms/register-form"
import React from "react"

interface AuthPageProps {
  mode: "login" | "register"
}

const AuthPage = ({ mode }: AuthPageProps) => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{mode == "login" ? <LoginForm /> : <RegisterForm />}</div>
    </div>
  )
}

export default AuthPage
