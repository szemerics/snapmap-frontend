import { useUploadPhotoContext } from "@/context/UploadPhotoContext"
import { Drawer, DrawerClose, DrawerContent } from "../ui/drawer"
import { X } from "lucide-react"
import { Field, FieldGroup, FieldLabel } from "../ui/field"
import { useState } from "react"
import type { IUploadPhoto } from "@/interfaces/IPhoto"
import SelectOther from "./fields/SelectOther"
import DatePicker from "./fields/DatePicker"
import { CAMERA_BRANDS, CATEGORIES } from "@/constants/photoOptions"
import FileUploader from "./fields/FileUploader"

const UploadPhotoModal = () => {
  const { isOpen, closeUploadPhotoModal } = useUploadPhotoContext()

  const [uploadData, setUploadData] = useState<IUploadPhoto>({
    imageFile: null as any,
    location: {
      lat: 0,
      lng: 0,
    },
    date_captured: new Date().toDateString(),
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

  const handleChange = (field: keyof IUploadPhoto, value: any) => {
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

        {/* <FieldGroup>
          <FieldLabel>Gear</FieldLabel>
          <FieldLabel>Camera</FieldLabel>
          <Field>
            <FieldLabel>Brand</FieldLabel>
            <SelectOther
              uploadData={uploadData}
              setUploadData={setUploadData}
              selectField="brand"
              constant={CAMERA_BRANDS}
            />
          </Field>
          <Field>
            <FieldLabel>Model</FieldLabel>
          </Field>
          <Field>
            <FieldLabel>Type</FieldLabel>
          </Field>
        </FieldGroup> */}

        {/* <Field>
          <Button type="submit">Login</Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </FieldDescription>
        </Field> */}
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
