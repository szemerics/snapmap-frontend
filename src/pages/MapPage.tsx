import { Map } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

const MapPage = () => {
  return (
    <div className="w-screen h-screen">
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
      />
    </div>
  )
}

export default MapPage
