import { useState, type Dispatch, type SetStateAction } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import FullscreenMap from "./small-map/FullscreenMap"
import NonFullscreenMap from "./small-map/NonFullscreenMap"
import type { UploadPhotoFormData } from "../types"

type SmallMapProps = {
  uploadData: UploadPhotoFormData
  setUploadData: Dispatch<SetStateAction<UploadPhotoFormData>>
}

const SmallMap = ({ uploadData, setUploadData }: SmallMapProps) => {
  const [coordinates, setCoordinates] = useState({ lng: 20, lat: 50 })
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapKey, setMapKey] = useState(0)

  const savedMarker =
    uploadData?.lat !== null && uploadData?.lng !== null ? { lat: uploadData.lat, lng: uploadData.lng } : undefined

  const handleLocationSave = (coordinates: { lng: number; lat: number }) => {
    setUploadData((prev) => ({
      ...prev,
      lat: coordinates.lat,
      lng: coordinates.lng,
    }))
  }

  return (
    <>
      {!isFullscreen && (
        <NonFullscreenMap
          isDesktop={isDesktop}
          mapKey={mapKey}
          coordinates={coordinates}
          onChangeCoordinates={setCoordinates}
          savedMarker={savedMarker}
          onChangeSavedMarker={handleLocationSave}
          onOpen={() => setIsFullscreen(true)}
        />
      )}

      {isFullscreen && (
        <FullscreenMap
          coordinates={coordinates}
          onChangeCoordinates={setCoordinates}
          savedMarker={savedMarker}
          onChangeSavedMarker={handleLocationSave}
          onClose={() => {
            setIsFullscreen(false)
            setMapKey((prev) => prev + 1)
          }}
        />
      )}
    </>
  )
}

export default SmallMap
