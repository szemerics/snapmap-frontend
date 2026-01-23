import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogClose, DialogContent } from "../ui/dialog"
import { ChevronLeft } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent } from "../ui/drawer"
import Post from "../Post"
import type { IPhoto } from "@/interfaces/IPhoto"

type PhotoModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedPhoto: IPhoto
}

const PhotoModal = ({ isOpen, setIsOpen, selectedPhoto }: PhotoModalProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const BuildPost = () => <Post photo={selectedPhoto!} />

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
            <span>Posts</span>
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
          <span className="my-5">Posts</span>
        </div>
        <div className="overflow-y-auto max-h-screen flex flex-col no-scrollbar pb-5">
          <BuildPost />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default PhotoModal
