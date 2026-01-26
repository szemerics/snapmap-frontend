import type { IPhoto } from "@/interfaces/IPhoto"
import { Map, Marker } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useState } from "react"
import PhotoModal from "./PhotoModal"
import { photoService } from "@/services/photo.service"

const BaseMap = () => {
  const [photos, setPhotos] = useState<IPhoto[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<IPhoto>()

  useEffect(() => {
    async function fetchPhotos() {
      const data = await photoService.getPhotos<IPhoto[]>()
      setPhotos(data)
    }
    fetchPhotos()
  }, [])

  const handlePhotoClick = async (photo_id: string) => {
    const data = await photoService.getPhotos<IPhoto[]>({ photo_id })
    setSelectedPhoto(data[0])
    setIsOpen(true)
  }

  return (
    <>
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
      >
        {photos.map((photo) => (
          <Marker key={photo.id} longitude={photo.location.lng} latitude={photo.location.lat}>
            <img
              src={photo.photo_url}
              alt="Photo marker"
              className="w-10 h-10 rounded-sm border-2 border-border cursor-pointer object-cover"
              onClick={() => handlePhotoClick(photo.id)}
            />
          </Marker>
        ))}
      </Map>

      <PhotoModal isOpen={isOpen} setIsOpen={setIsOpen} selectedPhoto={selectedPhoto!} />
    </>
  )
}

export default BaseMap
