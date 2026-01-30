import { useUploadPhotoContext } from "@/context/UploadPhotoContext"
import { Drawer, DrawerClose, DrawerContent } from "../ui/drawer"
import { X } from "lucide-react"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import { useState } from "react"
import SelectOther from "./fields/SelectOther"
import DatePicker from "./fields/DatePicker"
import { CATEGORIES } from "@/constants/photoOptions"
import FileUploader from "./fields/FileUploader"
import { Button } from "../ui/button"
import CameraInputs from "./fields/CameraInputs"
import type { UploadPhotoFormData } from "./types"

const UploadPhotoModal = () => {
  const { isOpen, closeUploadPhotoModal } = useUploadPhotoContext()

  const [uploadData, setUploadData] = useState<UploadPhotoFormData>({
    imageFile: null,
    lat: 0,
    lng: 0,
    date_captured: new Date().toDateString(),
    category: "",
    camera_brand: "",
    camera_model: "",
    camera_type: "",
    lens: "",
    extra_attachment: "",
    settings_used: null,
    caption: "",
  })

  const handleChange = (field: string, value: any) => {
    setUploadData({ ...uploadData, [field]: value })
  }

  const uploadForm = (
    <form onSubmit={() => console.log("submitted")}>
      <FieldGroup>
        <Field>
          <FieldLabel>Image</FieldLabel>
          <FileUploader uploadData={uploadData} handleChange={handleChange} />
        </Field>

        <Field>
          <FieldLabel>Location</FieldLabel>
        </Field>

        <FieldGroup className="flex-row">
          <DatePicker uploadData={uploadData} handleChange={handleChange} />
        </FieldGroup>

        <Field>
          <FieldLabel>Category</FieldLabel>
          <SelectOther
            uploadData={uploadData}
            setUploadData={setUploadData}
            selectField="category"
            constant={CATEGORIES}
          />
        </Field>

        <FieldGroup>
          <FieldLabel>Gear</FieldLabel>
          <FieldLabel>Camera</FieldLabel>
          <CameraInputs uploadData={uploadData} setUploadData={setUploadData} handleChange={handleChange} />
        </FieldGroup>

        <Field>
          <Button type="submit">Upload</Button>
          <FieldDescription className="text-center">Uploading takes a while due to security checks</FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )

  console.log(uploadData)

  return (
    <Drawer open={isOpen} onOpenChange={closeUploadPhotoModal} direction="bottom">
      <DrawerContent className="h-screen">
        <div className="w-full flex justify-between items-center px-6 py-4 border-b">
          <span className="font-semibold">Upload Photo</span>
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
