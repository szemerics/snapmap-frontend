import { useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
// import type { IPhoto } from "@/interfaces/IPhoto"

type ProfilePhotosProps = {
  photoSummaries: { photo_id: string; photo_url: string }[]
}

const ProfilePhotos = ({ photoSummaries }: ProfilePhotosProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handlePhotoClick = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className="w-full sm:max-w-sm sm:mx-auto grid grid-cols-3">
        {photoSummaries.map((photo_summary) => (
          <img
            key={photo_summary.photo_id}
            src={photo_summary.photo_url}
            alt="Profile photo"
            className="w-full h-auto border border-background object-cover aspect-square"
            onClick={handlePhotoClick}
          />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <div className="overflow-y-auto max-h-screen">
            {photoSummaries.map((photo_summary) => (
              <img src={photo_summary.photo_url} alt="" />
            ))}
          </div>

          {/* <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </DialogDescription>
          </DialogHeader> */}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProfilePhotos
