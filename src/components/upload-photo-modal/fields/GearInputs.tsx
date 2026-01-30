import { Field, FieldLabel } from "@/components/ui/field"
import { type Dispatch, type SetStateAction } from "react"
import SelectOther from "./SelectOther"
import { Input } from "@/components/ui/input"
import { CAMERA_BRANDS, CAMERA_TYPES } from "@/constants/photoOptions"
import type { UploadPhotoFormData } from "../types"
import { handleUploadDataChange } from "../helpers"

type GearInputsProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
}

const GearInputs = ({ uploadData, setUploadData }: GearInputsProps) => {
  return (
    <>
      <Field>
        <FieldLabel>Camera Brand</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="camera_brand"
          constant={CAMERA_BRANDS}
        />
      </Field>
      <Field>
        <FieldLabel>Camera Model</FieldLabel>
        <Input
          placeholder="A6000"
          value={uploadData.camera_model}
          onChange={(e) => handleUploadDataChange(uploadData, setUploadData, "camera_model", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Camera Type</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="camera_type"
          constant={CAMERA_TYPES}
        />
      </Field>
      <Field>
        <FieldLabel>Lens</FieldLabel>
        <Input
          placeholder="Nikkor 50mm f/1.8"
          value={uploadData.lens}
          onChange={(e) => handleUploadDataChange(uploadData, setUploadData, "lens", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Extra Attachment</FieldLabel>
        <Input
          placeholder="External flash"
          value={uploadData.extra_attachment}
          onChange={(e) => handleUploadDataChange(uploadData, setUploadData, "extra_attachment", e.target.value)}
        />
      </Field>
    </>
  )
}

export default GearInputs
