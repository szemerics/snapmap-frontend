import { useUploadPhotoContext } from "@/context/UploadPhotoContext"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "../ui/drawer"
import { X } from "lucide-react"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { useMemo, useState } from "react"
import SelectOther from "./fields/SelectOther"
import DatePicker from "./fields/DatePicker"
import { CATEGORIES } from "@/constants/photoOptions"
import FileUploader from "./fields/FileUploader"
import { Button } from "../ui/button"
import type { UploadPhotoFormData } from "./types"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import GearInputs from "./fields/GearInputs"
import SettingsInputs from "./fields/SettingsInputs"
import { getDefaultUploadData, handleUploadDataChange } from "./helpers"
import SmallMap from "./fields/SmallMap"

const snapPoints = [0.67, 1]

const UploadPhotoModal = () => {
  const { isOpen, closeUploadPhotoModal } = useUploadPhotoContext()
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

  const [uploadData, setUploadData] = useState<UploadPhotoFormData>(getDefaultUploadData())

  const handleSubmit = () => {
    console.log("submitted")
  }

  const uploadForm = useMemo(
    () => (
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel>Image</FieldLabel>
            <FileUploader uploadData={uploadData} setUploadData={setUploadData} />
          </Field>

          <Field>
            <FieldLabel>Location</FieldLabel>
            <SmallMap />
          </Field>

          <FieldGroup className="flex-row">
            <DatePicker uploadData={uploadData} setUploadData={setUploadData} />
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="category-input">Category</FieldLabel>
            <SelectOther
              uploadData={uploadData}
              setUploadData={setUploadData}
              selectField="category"
              constant={CATEGORIES}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="caption-input">Caption</FieldLabel>
            <Textarea
              id="caption-input"
              name="caption"
              placeholder="Enter caption of post"
              value={uploadData.caption}
              onChange={(e) => handleUploadDataChange(uploadData, setUploadData, "caption", e.target.value)}
            />
          </Field>

          <Separator />

          <FieldGroup>
            <div className="text-sm font-medium mb-2">Gear</div>
            <GearInputs uploadData={uploadData} setUploadData={setUploadData} />
          </FieldGroup>

          <Separator />

          <FieldGroup>
            <div className="text-sm font-medium mb-2">Settings Used</div>
            <SettingsInputs uploadData={uploadData} setUploadData={setUploadData} />
          </FieldGroup>

          <Field>
            <Button id="submit-button" type="submit">
              Upload
            </Button>
            <FieldDescription className="text-center">Uploading takes a while due to security checks</FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    ),
    [uploadData]
  )

  return (
    <Drawer
      open={isOpen}
      onOpenChange={closeUploadPhotoModal}
      direction="bottom"
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <DrawerContent className="h-full max-h-screen!">
        <div className="w-full flex justify-between items-center px-6 py-4 border-b">
          <DrawerTitle className="font-semibold">Upload Photo</DrawerTitle>
          <DrawerDescription className="sr-only">Upload your photo and details here</DrawerDescription>
          <DrawerClose>
            <X />
          </DrawerClose>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{uploadForm}</div>
      </DrawerContent>
    </Drawer>
  )
}

export default UploadPhotoModal
