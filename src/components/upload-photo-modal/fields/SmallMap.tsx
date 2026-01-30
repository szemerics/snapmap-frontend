import { Map } from "@vis.gl/react-maplibre"
import { useState } from "react"
import { Dot } from "lucide-react"

const SmallMap = () => {
  const [coordinates, setCoordinates] = useState({ lng: 20, lat: 50 })

  return (
    <div className="w-full h-80 rounded-md overflow-hidden border relative">
      <Map
        initialViewState={{
          longitude: 20,
          latitude: 50,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "100%" }}
        // mapStyle="https://tiles.openfreemap.org/styles/liberty"
        mapStyle="public/styles/dark_matter_edited.json"
        attributionControl={false}
        onMove={(evt) => {
          const center = evt.viewState
          setCoordinates({
            lng: parseFloat(center.longitude.toFixed(6)),
            lat: parseFloat(center.latitude.toFixed(6)),
          })
        }}
      ></Map>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative">
          <div className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2">
            <Dot className="w-full h-full " />
          </div>
        </div>
      </div>

      <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1.5 rounded text-sm font-mono">
        Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
      </div>
    </div>
  )
}

export default SmallMap
