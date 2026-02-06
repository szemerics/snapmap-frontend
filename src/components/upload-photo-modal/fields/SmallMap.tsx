import { useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import FullscreenMap from "./small-map/FullscreenMap"
import NonFullscreenMap from "./small-map/NonFullscreenMap"

const SmallMap = () => {
  const [coordinates, setCoordinates] = useState({ lng: 20, lat: 50 })
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [savedMarker, setSavedMarker] = useState<{ lng: number; lat: number } | undefined>(undefined)
  const [mapKey, setMapKey] = useState(0)

  return (
    <>
      {!isFullscreen && (
        <NonFullscreenMap
          isDesktop={isDesktop}
          mapKey={mapKey}
          coordinates={coordinates}
          onChangeCoordinates={setCoordinates}
          savedMarker={savedMarker}
          onChangeSavedMarker={setSavedMarker}
          onOpen={() => setIsFullscreen(true)}
        />
      )}

      {isFullscreen && (
        <FullscreenMap
          coordinates={coordinates}
          onChangeCoordinates={setCoordinates}
          savedMarker={savedMarker}
          onChangeSavedMarker={setSavedMarker}
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
