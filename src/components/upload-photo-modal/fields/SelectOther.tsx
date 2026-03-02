import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { Input } from "../../ui/input"

import type { UploadPhotoFormData } from "../types"
import { handleUploadDataChange } from "../helpers"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

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

  const handleSelectChange = (field: keyof UploadPhotoFormData, value: string | null) => {
    if (value === "Other") {
      setOtherFields((prev) => ({
        ...prev,
        [field as string]: { isOther: true, customValue: prev[field as string]?.customValue || "" },
      }))

      // clear value after switching to "Other"
      handleUploadDataChange(uploadData, setUploadData, field, "")
    } else {
      setOtherFields((prev) => ({
        ...prev,
        [field as string]: { isOther: false, customValue: "" },
      }))
      handleUploadDataChange(uploadData, setUploadData, field, value ?? "")
    }
  }

  const handleCustomValueChange = (field: keyof UploadPhotoFormData, value: string) => {
    setOtherFields((prev) => ({
      ...prev,
      [field as string]: { ...prev[field as string], customValue: value },
    }))
    handleUploadDataChange(uploadData, setUploadData, field, value)
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
      <Combobox items={constant}>
        <ComboboxInput
          placeholder={`Select ${formatPlaceholder(selectField)}`}
          className={isOther ? "w-2/3" : "w-full"}
        />
        <ComboboxContent className="max-h-80!">
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="mb-2 pointer-events-auto"
                onClick={() => handleSelectChange(selectField, item as string | null)}
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {isOther && (
        <Input
          id={`${selectField}-custom-input`}
          name={`${selectField}_custom`}
          className="w-full"
          placeholder={`Enter custom ${formatPlaceholder(selectField)}`}
          value={otherFields[selectField]?.customValue || ""}
          onChange={(e) => handleCustomValueChange(selectField, e.target.value)}
        />
      )}
    </div>
  )
}

export default SelectOther
