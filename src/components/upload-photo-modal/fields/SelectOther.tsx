import { useState, type Dispatch, type SetStateAction } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Input } from "../../ui/input"

import type { UploadPhotoFormData } from "../types"

type SelectProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
  selectField: keyof UploadPhotoFormData
  constant: readonly string[]
}

const SelectOther = ({ uploadData, setUploadData, selectField, constant }: SelectProps) => {
  const [otherFields, setOtherFields] = useState<Record<string, { isOther: boolean; customValue: string }>>({})

  const handleSelectChange = (field: string, value: any) => {
    if (value === "Other") {
      setOtherFields({
        ...otherFields,
        [field]: { isOther: true, customValue: otherFields[field]?.customValue || "" },
      })
      setUploadData({ ...uploadData, [field]: otherFields[field]?.customValue || "" })
    } else {
      setOtherFields({
        ...otherFields,
        [field]: { isOther: false, customValue: "" },
      })
      setUploadData({ ...uploadData, [field]: value })
    }
  }

  const handleCustomValueChange = (field: string, value: string) => {
    setOtherFields({
      ...otherFields,
      [field]: { ...otherFields[field], customValue: value },
    })
    setUploadData({ ...uploadData, [field]: value })
  }

  const formatPlaceholder = (selectField: string) => {
    const formatted = selectField
    return formatted.replace("_", " ")
  }

  return (
    <div className="flex gap-2 items-center text-base">
      <Select name={selectField} onValueChange={(value) => handleSelectChange(selectField, value)}>
        <SelectTrigger id={`${selectField}-input`} className={otherFields[selectField]?.isOther ? "w-1/3" : "w-full"}>
          <SelectValue placeholder={`Select ${formatPlaceholder(selectField)}`} />
        </SelectTrigger>
        <SelectContent className="max-h-80!" position="popper">
          <SelectGroup>
            {constant.map((selectField: string, idx) => (
              <SelectItem key={idx} value={selectField} className="mb-2">
                {selectField}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {otherFields[selectField]?.isOther && (
        <Input
          id={`${selectField}-custom-input`}
          name={`${selectField}_custom`}
          className="w-2/3"
          placeholder={`Enter custom ${formatPlaceholder(selectField)}`}
          value={otherFields[selectField]?.customValue || ""}
          onChange={(e) => handleCustomValueChange(selectField, e.target.value)}
        />
      )}
    </div>
  )
}

export default SelectOther
