import { useUploadPhotoContext } from "@/context/UploadPhotoContext"
import { Drawer, DrawerClose, DrawerContent } from "./ui/drawer"
import { Upload, X } from "lucide-react"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import type { IUploadPhoto } from "@/interfaces/IPhoto"
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "./ui/file-upload"
import { photoService } from "@/services/photo.service"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

const UploadPhotoModal = () => {
  const [photoOptions, setPhotoOptions] = useState<any>(null)
  const { isOpen, closeUploadPhotoModal } = useUploadPhotoContext()
  const [uploadData, setUploadData] = useState<IUploadPhoto>({
    imageFile: null as any,
    location: {
      lat: 0,
      lng: 0,
    },
    date_captured: new Date().toISOString(),
    category: "",
    gear: {
      camera: {
        brand: "",
        model: "",
        type: "",
      },
      lens: "",
      extra_attachment: "",
    },
    settings_used: null,
    date_posted: new Date().toISOString(),
    caption: "",
  })

  useEffect(() => {
    async function fetchPhotoOptions() {
      const options = await photoService.getPhotoOptions<any>()
      setPhotoOptions(options)
    }
    fetchPhotoOptions()
  })

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        return "Only image files are allowed"
      }

      return null
    },
    [uploadData.imageFile]
  )

  const handleImageRemove = () => {
    setUploadData({ ...uploadData, imageFile: null as any })
  }

  const UploadForm = () => (
    <form onSubmit={() => console.log("submitted")}>
      <FieldGroup>
        <Field>
          <FieldLabel>Image</FieldLabel>
          <FileUpload
            className="w-full max-w-md"
            accept="image/*"
            value={uploadData.imageFile ? [uploadData.imageFile] : []}
            onValueChange={(newFiles) => {
              setUploadData({ ...uploadData, imageFile: newFiles[0] || null })
            }}
            onFileValidate={onFileValidate}
            disabled={!!uploadData.imageFile}
          >
            <FileUploadDropzone className={`${uploadData.imageFile ? "opacity-50 pointer-events-none" : " "}`}>
              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center justify-center rounded-full border p-2.5">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">Or click to browse (max 1 file)</p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2 w-fit">
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {uploadData.imageFile && (
                <FileUploadItem value={uploadData.imageFile}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <FileUploadItemDelete asChild>
                    <Button onClick={handleImageRemove} variant="ghost" size="icon" className="size-7">
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              )}
            </FileUploadList>
          </FileUpload>
        </Field>

        <Field>
          <FieldLabel>Location</FieldLabel>
        </Field>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <Input
            id="category"
            type="category"
            placeholder="trainspotting"
            required
            onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
          />
          {/* <Select>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectGroup>
                <SelectLabel>Fruits</SelectLabel>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> */}
        </Field>

        {/* <Field>
          <Button type="submit">Login</Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </FieldDescription>
        </Field> */}
      </FieldGroup>
    </form>
  )

  return (
    <Drawer open={isOpen} onOpenChange={closeUploadPhotoModal} direction="bottom">
      <DrawerContent className="h-screen">
        <div className="w-full flex justify-between items-center px-6 py-4 border-b">
          <span className="font-semibold">Upload Photo</span>
          <DrawerClose>
            <X />
          </DrawerClose>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <UploadForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default UploadPhotoModal
