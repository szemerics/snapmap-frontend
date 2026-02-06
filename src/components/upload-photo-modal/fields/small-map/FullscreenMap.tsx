import { Button } from "@/components/ui/button"
import { Dot, MapPinPlus, Minimize } from "lucide-react"
import { Map, Marker } from "@vis.gl/react-maplibre"

type FullScreenMapProps = {
  coordinates: { lng: number; lat: number }
  onChangeCoordinates: (coordinates: { lng: number; lat: number }) => void
  savedMarker: { lng: number; lat: number } | undefined
  onChangeSavedMarker: (coordinates: { lng: number; lat: number }) => void
  onClose: () => void
}

const FullscreenMap = ({
  coordinates,
  onChangeCoordinates,
  savedMarker,
  onChangeSavedMarker,
  onClose,
}: FullScreenMapProps) => {
  return (
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
      <Button variant={"secondary"} className="absolute right-4 top-4 z-50" onClick={onClose}>
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
          onChangeCoordinates({
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
          onChangeSavedMarker(coordinates)
        }}
      >
        <MapPinPlus />
        Place Marker
      </Button>
    </div>
  )
}

export default FullscreenMap
