import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ChevronLeft } from "lucide-react"

const NotFoundPage = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
      <h3 className="">404 - Not Found</h3>
      <span className="text-muted-foreground text-sm">The page you're looking for doesn't exist. </span>
      <Link to={"/"}>
        <Button variant={"secondary"}>
          <ChevronLeft />
          Go back to Home
        </Button>
      </Link>
    </div>
  )
}

export default NotFoundPage
