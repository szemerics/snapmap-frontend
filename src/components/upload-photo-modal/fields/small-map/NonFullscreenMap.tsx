import { Button } from "@/components/ui/button"
import { Dot, Expand, MapPinPlus } from "lucide-react"
import { Map, Marker } from "@vis.gl/react-maplibre"

type NonFullscreenMap = {
  isDesktop: boolean
  mapKey: number
  coordinates: { lng: number; lat: number }
  onChangeCoordinates: (coordinates: { lng: number; lat: number }) => void
  savedMarker: { lng: number; lat: number } | undefined
  onChangeSavedMarker: (coordinates: { lng: number; lat: number }) => void
  onOpen: () => void
}

const NonFullscreenMap = ({
  isDesktop,
  mapKey,
  coordinates,
  onChangeCoordinates,
  savedMarker,
  onChangeSavedMarker,
  onOpen,
}: NonFullscreenMap) => {
  return (
    <div id="location" className="w-full h-80 rounded-md overflow-hidden border relative">
      {isDesktop ? (
        <Button
          variant={"secondary"}
          className="absolute right-2 top-2 z-50"
          onClick={(e) => {
            e.preventDefault()
            onOpen()
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
            onOpen()
          }}
        >
          <Expand />
          Tap to fullscreen
        </Button>
      )}
      <div
        className="w-full h-full"
        {...(isDesktop && {
          style: { touchAction: "none" },
          onTouchStart: (e: React.TouchEvent) => e.stopPropagation(),
          onTouchMove: (e: React.TouchEvent) => e.stopPropagation(),
          onTouchEnd: (e: React.TouchEvent) => e.stopPropagation(),
          onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
        })}
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
            onChangeCoordinates({
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
              onChangeSavedMarker(coordinates)
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
  )
}

export default NonFullscreenMap
