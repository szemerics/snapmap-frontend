import { Field, FieldLabel } from "@/components/ui/field"
import { type Dispatch, type SetStateAction } from "react"
import SelectOther from "./SelectOther"
import { Input } from "@/components/ui/input"
import { APERTURES, CAMERA_BRANDS, CAMERA_TYPES, SHUTTER_SPEEDS } from "@/constants/photoOptions"
import type { UploadPhotoFormData } from "../types"

type SettingsInputsProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
  handleChange: (field: keyof UploadPhotoFormData, value: any) => void
}

const SettingsInputs = ({ uploadData, setUploadData, handleChange }: SettingsInputsProps) => {
  return (
    <>
      <Field>
        <FieldLabel>ISO</FieldLabel>
        <Input
          type="number"
          min="1"
          placeholder="100"
          value={uploadData.iso}
          onChange={(e) => handleChange("iso", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Shutter Speed</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="shutter_speed"
          constant={SHUTTER_SPEEDS}
        />
      </Field>
      <Field>
        <FieldLabel>Aperture</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="aperture"
          constant={APERTURES}
        />
      </Field>
    </>
  )
}

export default SettingsInputs
