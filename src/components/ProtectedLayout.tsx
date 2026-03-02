import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import Navbar from "./Navbar"

interface ProtectedLayoutProps {
  children: ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { pathname } = useLocation()
  const isMapPage = pathname === "/map"

  return (
    <div className="min-h-svh">
      {/* Desktop fixed sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-svh md:w-64 lg:w-72 border-r">
        <Navbar variant="desktop" />
      </div>

      {/* Main content area */}
      <div className="flex flex-col min-h-svh pb-20 md:pb-0 md:ml-64 lg:ml-72">
        <main className="flex-1 flex justify-center items-stretch p-0">
          {isMapPage ? (
            <div className="w-full h-full">{children}</div>
          ) : (
            <div className="w-full max-w-2xl h-full">{children}</div>
          )}
        </main>

        {/* Mobile bottom navbar */}
        <div className="md:hidden">
          <Navbar variant="mobile" />
        </div>
      </div>
    </div>
  )
}

export default ProtectedLayout
