import { createContext, useContext, useState, type ReactNode } from "react"

type UploadPhotoContextType = {
  isOpen: boolean
  openUploadPhotoModal: () => void
  closeUploadPhotoModal: () => void
}

const UploadPhotoContext = createContext<UploadPhotoContextType | null>(null)

export const UploadPhotoProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <UploadPhotoContext.Provider
      value={{
        isOpen,
        openUploadPhotoModal: () => setIsOpen(true),
        closeUploadPhotoModal: () => setIsOpen(false),
      }}
    >
      {children}
    </UploadPhotoContext.Provider>
  )
}

export const useUploadPhotoContext = () => {
  const uploadPhotoContext = useContext(UploadPhotoContext)

  if (!uploadPhotoContext) {
    throw new Error("useUploadPhotoContext must be used within provider")
  }

  return uploadPhotoContext
}
