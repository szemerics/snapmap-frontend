import type { IUploadPhoto } from "@/interfaces/IPhoto"
import { useState, type Dispatch, type SetStateAction } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Input } from "../../ui/input"

type SelectProps = {
  uploadData: IUploadPhoto
  setUploadData: Dispatch<SetStateAction<IUploadPhoto>>
  selectField: keyof IUploadPhoto
  constant: Readonly<string[]>
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

  return (
    <div className="flex gap-2 items-center">
      <Select onValueChange={(value) => handleSelectChange(selectField, value)}>
        <SelectTrigger className={otherFields[selectField]?.isOther ? "w-1/3" : "w-full"}>
          <SelectValue placeholder={`Select a ${selectField}`} />
        </SelectTrigger>
        <SelectContent className="max-h-80!" position="popper">
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {constant.map((selectField: string) => (
              <SelectItem value={selectField} className="mb-2">
                {selectField}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {otherFields[selectField]?.isOther && (
        <Input
          className="w-2/3"
          placeholder={`Enter custom ${selectField}`}
          value={otherFields[selectField]?.customValue || ""}
          onChange={(e) => handleCustomValueChange(selectField, e.target.value)}
        />
      )}
    </div>
  )
}

export default SelectOther
