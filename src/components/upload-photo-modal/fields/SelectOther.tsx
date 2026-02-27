import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
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

  const fieldValue = uploadData[selectField]

  useEffect(() => {
    if (fieldValue === null || fieldValue === undefined) {
      setOtherFields((prev) => ({
        ...prev,
        [selectField]: { isOther: false, customValue: "" },
      }))
      return
    }

    const valueStr = String(fieldValue)

    if (valueStr === "") {
      return
    }

    const matchedConstant = constant.find((option) => option.toLowerCase() === valueStr.toLowerCase())

    if (matchedConstant) {
      setOtherFields((prev) => ({
        ...prev,
        [selectField]: { isOther: false, customValue: "" },
      }))
    } else {
      setOtherFields((prev) => ({
        ...prev,
        [selectField]: { isOther: true, customValue: valueStr },
      }))
    }
  }, [fieldValue, selectField, constant])

  const handleSelectChange = (field: string, value: any) => {
    if (value === "Other") {
      setOtherFields((prev) => ({
        ...prev,
        [field]: { isOther: true, customValue: prev[field]?.customValue || "" },
      }))
      setUploadData((prev) => ({
        ...prev,
        [field]: otherFields[field]?.customValue || "",
      }))
    } else {
      setOtherFields((prev) => ({
        ...prev,
        [field]: { isOther: false, customValue: "" },
      }))
      setUploadData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleCustomValueChange = (field: string, value: string) => {
    setOtherFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], customValue: value },
    }))
    setUploadData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatPlaceholder = (selectField: string) => {
    const formatted = selectField
    return formatted.replace("_", " ")
  }

  const isOther = otherFields[selectField]?.isOther

  const getSelectValue = () => {
    if (isOther) {
      return "Other"
    }

    if (fieldValue === null || fieldValue === undefined) {
      return ""
    }

    const valueStr = String(fieldValue)
    const matchedConstant = constant.find((option) => option.toLowerCase() === valueStr.toLowerCase())

    return matchedConstant || ""
  }

  return (
    <div className="flex gap-2 items-center text-base">
      <Select
        name={selectField}
        value={getSelectValue() || undefined}
        onValueChange={(value) => handleSelectChange(selectField, value)}
      >
        <SelectTrigger id={`${selectField}-input`} className={isOther ? "w-1/3" : "w-full"}>
          <SelectValue placeholder={`Select ${formatPlaceholder(selectField)}`} />
        </SelectTrigger>
        <SelectContent className="max-h-80!" position="popper">
          <SelectGroup>
            {constant.map((option: string, idx) => (
              <SelectItem key={idx} value={option} className="mb-2">
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isOther && (
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
