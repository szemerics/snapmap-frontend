import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useState, type Dispatch, type SetStateAction } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

import type { UploadPhotoFormData } from "../types"
import { handleUploadDataChange } from "../helpers"

type DatePickerProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
  dateError?: string
  timeError?: string
}

const DatePicker = ({ uploadData, setUploadData, dateError, timeError }: DatePickerProps) => {
  const [openDate, setOpenDate] = useState(false)

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploadData.date_captured) {
      const date = new Date(uploadData.date_captured)
      const [hoursStr, minutesStr, secondsStr] = e.target.value.split(":")
      const hours = Number(hoursStr)
      const minutes = Number(minutesStr)
      const seconds = secondsStr ? Number(secondsStr) : 0

      if (!Number.isNaN(hours) && !Number.isNaN(minutes) && !Number.isNaN(seconds)) {
        date.setHours(hours, minutes, seconds)
        handleUploadDataChange(uploadData, setUploadData, "date_captured", date.toISOString())
      }
    }
  }

  return (
    <>
      <Field data-invalid={!!dateError}>
        <FieldLabel htmlFor="date-picker-button">
          Date <span className="text-destructive -ml-1">*</span>
        </FieldLabel>
        <Popover open={openDate} onOpenChange={setOpenDate}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-button"
              name="date_captured"
              className="w-32 justify-between font-normal"
            >
              {uploadData.date_captured ? format(new Date(uploadData.date_captured), "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={uploadData.date_captured ? new Date(uploadData.date_captured) : undefined}
              captionLayout="dropdown"
              defaultMonth={uploadData.date_captured ? new Date(uploadData.date_captured) : undefined}
              onSelect={(date) => {
                handleUploadDataChange(uploadData, setUploadData, "date_captured", date ? date.toISOString() : null)
                setOpenDate(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32" data-invalid={!!timeError}>
        <FieldLabel htmlFor="time-picker-input">
          Time <span className="text-destructive -ml-1">*</span>
        </FieldLabel>
        <Input
          type="time"
          id="time-picker-input"
          name="time"
          step="1"
          value={uploadData.date_captured ? format(new Date(uploadData.date_captured), "HH:mm:ss") : ""}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
        <FieldError>{timeError}</FieldError>
      </Field>
    </>
  )
}

export default DatePicker
