import { Field, FieldLabel } from "@/components/ui/field"
import { type Dispatch, type SetStateAction } from "react"
import SelectOther from "./SelectOther"
import { Input } from "@/components/ui/input"
import { APERTURES, SHUTTER_SPEEDS } from "@/constants/photoOptions"
import type { UploadPhotoFormData } from "../types"
import { handleUploadDataChange } from "../helpers"

type SettingsInputsProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
}

const SettingsInputs = ({ uploadData, setUploadData }: SettingsInputsProps) => {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="iso-input">ISO</FieldLabel>
        <Input
          id="iso-input"
          name="iso"
          type="number"
          min="1"
          placeholder="100"
          value={uploadData.iso ?? ""}
          onChange={(e) => handleUploadDataChange(uploadData, setUploadData, "iso", e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="shutter_speed-input">Shutter Speed</FieldLabel>
        <SelectOther
          uploadData={uploadData}
          setUploadData={setUploadData}
          selectField="shutter_speed"
          constant={SHUTTER_SPEEDS}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="aperture-input">Aperture</FieldLabel>
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
