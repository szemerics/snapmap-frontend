import { useState } from "react"
import ProfilePosts from "./ProfilePosts"
import type { IUser } from "@/interfaces/IUser"

type ProfilePhotosProps = {
  targetUser: IUser
}

const ProfilePhotos = ({ targetUser }: ProfilePhotosProps) => {
  const photoSummaries = targetUser.photo_summaries
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index)
    setIsOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-3">
        {photoSummaries.map((photo_summary, index) => (
          <img
            key={index}
            src={photo_summary.photo_url}
            alt="Profile photo"
            className="w-full h-auto border border-background object-cover aspect-square"
            onClick={() => handlePhotoClick(index)}
          />
        ))}
      </div>

      <ProfilePosts isOpen={isOpen} setIsOpen={setIsOpen} selectedIndex={selectedIndex} targetUser={targetUser} />
    </>
  )
}

export default ProfilePhotos
