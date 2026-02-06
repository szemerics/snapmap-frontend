import { getDefaultUploadData } from "@/components/upload-photo-modal/helpers"
import type { UploadPhotoFormData } from "@/components/upload-photo-modal/types"
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

type UploadPhotoContextType = {
  isOpen: boolean
  openUploadPhotoModal: () => void
  closeUploadPhotoModal: () => void
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
}

const UploadPhotoContext = createContext<UploadPhotoContextType | null>(null)

export const UploadPhotoProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadData, setUploadData] = useState<UploadPhotoFormData>(getDefaultUploadData())

  return (
    <UploadPhotoContext.Provider
      value={{
        isOpen,
        openUploadPhotoModal: () => setIsOpen(true),
        closeUploadPhotoModal: () => setIsOpen(false),
        uploadData,
        setUploadData,
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
