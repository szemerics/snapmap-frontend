import { Map, Marker } from "@vis.gl/react-maplibre"
import { useState } from "react"
import { Dot, Minimize, MapPinPlus } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Expand } from "lucide-react"

const SmallMap = () => {
  const [coordinates, setCoordinates] = useState({ lng: 20, lat: 50 })
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [savedMarker, setSavedMarker] = useState<{ lng: number; lat: number } | undefined>(undefined)
  const [mapKey, setMapKey] = useState(0)

  return (
    <>
      <div id="location" className="w-full h-80 rounded-md overflow-hidden border relative">
        {isDesktop ? (
          <Button
            variant={"secondary"}
            className="absolute right-2 top-2 z-50"
            onClick={(e) => {
              e.preventDefault()
              setIsFullscreen(true)
            }}
          >
            <Expand />
          </Button>
        ) : (
          <Button
            variant={"secondary"}
            className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            onClick={(e) => {
              e.preventDefault()
              setIsFullscreen(true)
            }}
          >
            <Expand />
            Tap to fullscreen
          </Button>
        )}
        <div
          className="w-full h-full"
          style={{ touchAction: "none" }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          onTouchMove={(e) => {
            e.stopPropagation()
          }}
          onTouchEnd={(e) => {
            e.stopPropagation()
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
        >
          <Map
            key={mapKey}
            initialViewState={{
              longitude: savedMarker ? savedMarker.lng : 20,
              latitude: savedMarker ? savedMarker.lat : 50,
              zoom: savedMarker ? 10 : 3.5,
            }}
            style={!isDesktop ? { opacity: "0.5", filter: "blur(1px)" } : undefined}
            mapStyle="public/styles/dark_matter_edited.json"
            interactive={isDesktop ? true : false}
            attributionControl={false}
            onMove={(evt) => {
              const center = evt.viewState
              setCoordinates({
                lng: parseFloat(center.longitude.toFixed(6)),
                lat: parseFloat(center.latitude.toFixed(6)),
              })
            }}
          >
            {savedMarker && <Marker longitude={savedMarker.lng} latitude={savedMarker.lat} />}
          </Map>
          {isDesktop && (
            <Button
              className="absolute bottom-2 right-2"
              onClick={(e) => {
                e.preventDefault()
                setSavedMarker(coordinates)
              }}
            >
              <MapPinPlus />
              Place Marker
            </Button>
          )}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2">
              <Dot className="w-full h-full " />
            </div>
          </div>
        </div>

        <div
          className={`absolute top-2 left-2 bg-black/70 text-white px-3 py-1.5 rounded text-sm font-mono ${!isDesktop ? "hidden" : ""}`}
        >
          Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
        </div>
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-9999 bg-background mt-19.25"
          style={{ touchAction: "none" }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          onTouchMove={(e) => {
            e.stopPropagation()
          }}
          onTouchEnd={(e) => {
            e.stopPropagation()
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
          }}
        >
          <Button
            variant={"secondary"}
            className="absolute right-4 top-4 z-50"
            onClick={() => {
              setIsFullscreen(false)
              setMapKey((prev) => prev + 1)
            }}
          >
            <Minimize />
          </Button>

          <Map
            initialViewState={{
              longitude: savedMarker ? savedMarker.lng : 20,
              latitude: savedMarker ? savedMarker.lat : 50,
              zoom: savedMarker ? 14 : 3.5,
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="public/styles/dark_matter_edited.json"
            attributionControl={false}
            onMove={(evt) => {
              const center = evt.viewState
              setCoordinates({
                lng: parseFloat(center.longitude.toFixed(6)),
                lat: parseFloat(center.latitude.toFixed(6)),
              })
            }}
          >
            {savedMarker && <Marker longitude={savedMarker.lng} latitude={savedMarker.lat} />}
          </Map>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2">
                <Dot className="w-full h-full " />
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded text-sm font-mono">
            Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
          </div>
          <Button
            className="absolute bottom-2 left-1/2 -translate-x-1/2"
            onClick={(e) => {
              e.preventDefault()
              setSavedMarker(coordinates)
            }}
          >
            <MapPinPlus />
            Place Marker
          </Button>
        </div>
      )}
    </>
  )
}

export default SmallMap
