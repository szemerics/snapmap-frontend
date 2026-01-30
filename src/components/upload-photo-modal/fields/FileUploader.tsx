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
import { useCallback } from "react"

import type { UploadPhotoFormData } from "../types"
import { handleUploadDataChange } from "../helpers"
import type { Dispatch, SetStateAction } from "react"

type FileUploaderProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
}

const FileUploader = ({ uploadData, setUploadData }: FileUploaderProps) => {
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

  return (
    <>
      <FileUpload
        className="w-full"
        accept="image/*"
        value={uploadData.imageFile ? [uploadData.imageFile] : []}
        onValueChange={(newFile) => {
          handleUploadDataChange(uploadData, setUploadData, "imageFile", newFile[0])
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
                <Button
                  onClick={() => handleUploadDataChange(uploadData, setUploadData, "imageFile", null as any)}
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
