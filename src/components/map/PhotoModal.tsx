import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog"
import { ChevronLeft } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import Post from "../Post"
import type { IPhoto } from "@/interfaces/IPhoto"
import { Separator } from "../ui/separator"

type PhotoModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedPhotos: IPhoto[]
  title: string
}

const PhotoModal = ({ isOpen, setIsOpen, selectedPhotos, title }: PhotoModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const BuildPost = () => (
    <>
      {selectedPhotos.map((photo, index) => (
        <div key={photo.id}>
          <Post photo={photo} />
          {index !== selectedPhotos.length - 1 ? <Separator className="my-6" /> : null}
        </div>
      ))}
    </>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="w-screen h-screen max-w-none m-0 p-6 sm:rounded-lg rounded-none"
          showCloseButton={false}
        >
          <div className="w-full flex justify-center items-center">
            <DialogClose className="absolute left-6 cursor-pointer">
              <ChevronLeft />
            </DialogClose>
            <DialogTitle className="my-5 text-sm">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              Photos by {selectedPhotos[0]?.user_summary?.username} photographer
            </DialogDescription>
            <span>{title}</span>
          </div>
          <div className="overflow-y-auto max-h-screen flex flex-col no-scrollbar">
            <BuildPost />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerContent className="w-screen! h-screen max-w-none rounded-none">
        <div className="w-full flex justify-center items-center">
          <DrawerClose className="absolute left-6">
            <ChevronLeft />
          </DrawerClose>
          <DrawerTitle className="my-5 text-sm">{title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            Photos by {selectedPhotos[0]?.user_summary?.username} photographer
          </DrawerDescription>
        </div>
        <div className="overflow-y-auto max-h-screen flex flex-col no-scrollbar pb-5">
          <BuildPost />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default PhotoModal
