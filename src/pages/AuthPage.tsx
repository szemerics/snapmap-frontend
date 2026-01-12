import LoginForm from "@/components/login-forms/login-form"
import RegisterForm from "@/components/login-forms/register-form"
import TextLogo from "@/assets/TextLogo.svg"
import MarkerLogo from "@/assets/MarkerLogo.svg"
import GlowBackground from "@/assets/GlowBackground.png"

interface AuthPageProps {
  mode: "login" | "register"
}

const AuthPage = ({ mode }: AuthPageProps) => {
  if (localStorage.getItem("access_token")) {
    window.location.href = "/"
    return null
  }

  return (
    <div
      className="flex flex-col gap-6 min-h-svh w-full items-center justify-center p-6 md:p-1 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${GlowBackground})` }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex gap-1 sm:justify-start justify-center">
          <img src={MarkerLogo} alt="Map" />
          <img src={TextLogo} alt="SnapMap" />
        </div>
        {mode == "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  )
}

export default AuthPage
