import { Button } from "@/components/ui/button"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { Upload, X } from "lucide-react"
import { useCallback, useState } from "react"

import type { UploadPhotoFormData } from "../types"
import { fillFromExifData, handleUploadDataChange } from "../helpers"
import type { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"

type FileUploaderProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
}


const FileUploader = ({ uploadData, setUploadData }: FileUploaderProps) => {
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MiB
  const [rejectMessage, setRejectMessage] = useState<string | null>(null)
  const [exifError, setExifError] = useState<boolean>(false)

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        return "Only image files are allowed"
      }

      if (file.size > MAX_IMAGE_BYTES) {
        return "Image must be 10 MB or smaller"
      }

      return null
    },
    []
  )

  return (
    <>
      <FileUpload
        id="image-upload"
        className="w-full"
        accept="image/*"
        value={uploadData.imageFile ? [uploadData.imageFile] : []}
        onAccept={() => setRejectMessage(null)}
        onFileReject={(_file, message) => {setRejectMessage(message)
          toast.error(message, {
            position: "top-center",
          })
        }}

        onUpload={async (newFile) => {
          setRejectMessage(null)
          const file = newFile[0]

          try {
            const exifData = await fillFromExifData(file, uploadData, setUploadData)
            setExifError(!exifData)
          } catch {
            // EXIF is optional, continue without it if parsing fails
          }

          handleUploadDataChange(uploadData, setUploadData, "imageFile", file)
        }}
        onFileValidate={onFileValidate}
        maxSize={MAX_IMAGE_BYTES}
        disabled={!!uploadData.imageFile}
      >
        <FileUploadDropzone className={`${uploadData.imageFile ? "opacity-50 pointer-events-none" : " "}`}>
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">Or click to browse (max 1 file, up to 10 MB)</p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Browse files
            </Button>
          </FileUploadTrigger>
          {rejectMessage && (
            <p className="text-destructive mt-2 max-w-full text-center text-xs">{rejectMessage}</p>
          )}
        </FileUploadDropzone>
        <FileUploadList>
          {uploadData.imageFile && (
            <FileUploadItem value={uploadData.imageFile}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              {exifError && (
                <div className="text-yellow-500 text-xs mt-1">No EXIF data found. Please fill details manually.</div>
              )}
              <FileUploadItemDelete asChild>
                <Button
                  onClick={() => {
                    handleUploadDataChange(uploadData, setUploadData, "imageFile", null as any)
                    setRejectMessage(null)
                  }}
                  variant="ghost"
                  size="icon"
                  className="size-7"
                >
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
       
          )}
        </FileUploadList>
      </FileUpload>
    </>
  )
}

export default FileUploader
