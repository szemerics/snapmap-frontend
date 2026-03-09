import type { Dispatch, SetStateAction } from "react"
import type { UploadFormErrors, UploadPhotoFormData } from "./types"
import type { IUploadPhoto } from "@/interfaces/IPhoto"
import exifr from "exifr"
import z from "zod"
import { toast } from "sonner"

export const getDefaultUploadData = (): UploadPhotoFormData => ({
  imageFile: null,
  lat: null,
  lng: null,
  date_captured: new Date().toISOString(),
  category: "",
  camera_brand: "",
  camera_model: "",
  camera_type: "",
  lens: "",
  extra_attachment: "",
  iso: null,
  shutter_speed: "",
  aperture: "",
  caption: "",
})

export const handleUploadDataChange = (
  _uploadData: UploadPhotoFormData,
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>,
  field: keyof UploadPhotoFormData,
  value: any
): void => {
  setUploadData((prev) => ({
    ...prev,
    [field]: value,
  }))
}

/**
 * Formats the aperture value to the f-stop format
 */
export function formatApertureValueToFStop(apertureValue: number | null | undefined): string {
  if (apertureValue === null || apertureValue === undefined) {
    return ""
  }

  // EXIF ApertureValue is in APEX units: Av = log2(N^2), where N is the f-number.
  // So N = sqrt(2^Av).
  const fNumber = Math.sqrt(Math.pow(2, apertureValue))

  if (!Number.isFinite(fNumber) || fNumber <= 0) {
    return ""
  }

  const rounded = Math.round(fNumber * 10) / 10

  return `f/${rounded.toFixed(1)}`
}

/**
 * Formats the exif date time to the date captured format
 */
function formatExifDateTimeToDateCaptured(dateTime: string | Date): string {
  if (!dateTime) {
    return new Date().toISOString()
  }

  const parsed = typeof dateTime === "string" ? new Date(dateTime) : dateTime

  if (isNaN(parsed.getTime())) {
    return new Date().toISOString()
  }

  return parsed.toISOString()
}

/**
 * Fills the upload data with the exif data from the file
 */
export async function fillFromExifData(
  file: File,
  uploadData: UploadPhotoFormData,
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
) {
  const output = await exifr.parse(file)

  if (output.Make) {
    handleUploadDataChange(uploadData, setUploadData, "camera_brand", output.Make)
  }
  if (output.Model) {
    handleUploadDataChange(uploadData, setUploadData, "camera_model", output.Model)
  }
  if (output.ISO) {
    handleUploadDataChange(uploadData, setUploadData, "iso", output.ISO)
  }
  if (output.ApertureValue || output.MaxApertureValue) {
    handleUploadDataChange(
      uploadData,
      setUploadData,
      "aperture",
      formatApertureValueToFStop(output.ApertureValue ?? output.MaxApertureValue) ?? ""
    )
  }
  if (output.latitude && output.longitude) {
    handleUploadDataChange(uploadData, setUploadData, "lat", output.latitude)
    handleUploadDataChange(uploadData, setUploadData, "lng", output.longitude)
  }
  if (output.DateTimeOriginal) {
    handleUploadDataChange(
      uploadData,
      setUploadData,
      "date_captured",
      formatExifDateTimeToDateCaptured(output.DateTimeOriginal)
    )
  }
  if (output.LensModel) {
    handleUploadDataChange(uploadData, setUploadData, "lens", output.LensModel)
  }
}

/**
 * Formats the data before submitting it to the backend
 */
export function formatDataBeforeSubmit(data: UploadPhotoFormData): IUploadPhoto {
  if (!data.imageFile) {
    throw new Error("Image file is required")
  }

  const payload: IUploadPhoto = {
    imageFile: data.imageFile,
    date_captured: data.date_captured,
  }

  if (data.lat !== null && data.lng !== null) {
    payload.location = {
      lat: data.lat,
      lng: data.lng,
    }
  }

  if (data.category) {
    payload.category = data.category
  }

  if (data.camera_brand || data.camera_model || data.camera_type || data.lens || data.extra_attachment) {
    payload.gear = {
      camera: {
        brand: data.camera_brand || "",
        model: data.camera_model || "",
        type: data.camera_type || "",
      },
      lens: data.lens || "",
      extra_attachment: data.extra_attachment || "",
    }
  }

  if (data.iso || data.shutter_speed || data.aperture) {
    payload.settings_used = {
      iso: data.iso || 0,
      shutter_speed: data.shutter_speed || "",
      aperture: data.aperture || "",
    }
  }

  if (data.caption) {
    payload.caption = data.caption
  }

  return payload
}

const uploadPhotoSchema = z.object({
  imageFile: z.instanceof(File, {
    message: "Image is required",
  }),
  date_captured: z
    .string()
    .min(1, {
      message: "Date is required",
    })
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Date is required",
    }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
})

export async function validateUploadData(data: UploadPhotoFormData): Promise<UploadFormErrors> {
  try {
    await uploadPhotoSchema.parse(data)
    return {}
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: UploadFormErrors = {}

      for (const issue of error.issues) {
        const fieldName = issue.path[0]

        if (fieldName === "imageFile") {
          fieldErrors.imageFile = issue.message
        }

        if (fieldName === "date_captured") {
          fieldErrors.date = "Date is required"
          fieldErrors.time = "Time is required"
        }

        if (fieldName === "category") {
          fieldErrors.category = issue.message
        }
      }

      toast.error("Please fill in all required fields", {
        position: "top-center",
      })

      return fieldErrors
    }

    console.error("Unexpected validation error:", error)
    return {}
  }
}

export function clearErrorIfFieldIsFilled(
  data: UploadPhotoFormData,
  setErrors: Dispatch<SetStateAction<UploadFormErrors>>
): void {
  setErrors((prev) => {
    const next = { ...prev }

    if (data.imageFile && next.imageFile) {
      delete next.imageFile
    }

    if (data.date_captured && (next.date || next.time)) {
      delete next.date
      delete next.time
    }

    if (data.category && next.category) {
      delete next.category
    }

    return next
  })
}
