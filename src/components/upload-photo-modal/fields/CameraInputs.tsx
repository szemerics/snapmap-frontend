import { Field, FieldLabel } from "@/components/ui/field"
import { type Dispatch, type SetStateAction } from "react"
import SelectOther from "./SelectOther"
import { Input } from "@/components/ui/input"
import { CAMERA_BRANDS, CAMERA_TYPES } from "@/constants/photoOptions"
import type { UploadPhotoFormData } from "../types"

type CameraInputsProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
  handleChange: (field: keyof UploadPhotoFormData, value: any) => void
}

const CameraInputs = ({ uploadData, setUploadData, handleChange }: CameraInputsProps) => {
  return (
    <>
      <Field>
        <FieldLabel>Brand</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="camera_brand"
          constant={CAMERA_BRANDS}
        />
      </Field>
      <Field>
        <FieldLabel>Model</FieldLabel>
        <Input
          placeholder="A6000"
          value={uploadData.camera_model}
          onChange={(e) => handleChange("camera_model", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Type</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="camera_type"
          constant={CAMERA_TYPES}
        />
      </Field>
    </>
  )
}

export default CameraInputs
