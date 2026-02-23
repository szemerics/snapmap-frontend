import type { IPhoto } from "@/interfaces/IPhoto"
import { useSearchParams } from "react-router-dom"
import { Map, Marker, type MapRef } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useState, useRef, useMemo } from "react"
import Supercluster from "supercluster"
import PhotoModal from "./PhotoModal"
import { photoService } from "@/services/photo.service"
import type { Bounds, GeoJSON } from "./types"
import { resolveModalTitle, updateMapState } from "./helpers"

const BaseMap = () => {
  const mapRef = useRef<MapRef>(null)
  const [photos, setPhotos] = useState<IPhoto[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<IPhoto[]>([])
  const [modalTitle, setModalTitle] = useState("Photos near this area")
  const [searchParams] = useSearchParams()

  // Cluster system
  const [clusters, setClusters] = useState<any[]>([])
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [zoom, setZoom] = useState(3.5)
  const [initialViewSet, setInitialViewSet] = useState(false)
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    async function fetchPhotos() {
      const data = await photoService.getPhotos<IPhoto[]>({ photo_type: "map" })
      setPhotos(data)
    }
    fetchPhotos()
  }, [])

  useEffect(() => {
    const latParam = searchParams.get("lat")
    const lngParam = searchParams.get("lng")

    if (!latParam || !lngParam) {
      setTargetLocation(null)
      return
    }

    const lat = parseFloat(latParam)
    const lng = parseFloat(lngParam)

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setTargetLocation(null)
      return
    }

    setTargetLocation({ lat, lng })
  }, [searchParams])

  const points: GeoJSON[] = useMemo(() => {
    return photos.map((p) => ({
      type: "Feature",
      properties: { cluster: false, photoId: p.id, photoUrl: p.photo_url, data: p },
      geometry: {
        type: "Point",
        coordinates: [p.location!.lng, p.location!.lat],
      },
    }))
  }, [photos])

  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 40, // cluster radius in pixels
      maxZoom: 16, // max zoom to cluster points on
    })
    sc.load(points as any)
    return sc
  }, [points])

  useEffect(() => {
    if (bounds) {
      const newClusters = supercluster.getClusters(bounds, zoom)
      setClusters(newClusters)
    }
  }, [points, bounds, zoom, supercluster])

  const handlePhotoClick = async (photo_id: string) => {
    const data = await photoService.getPhotos<IPhoto[]>({ photo_id })
    setSelectedPhotos(data)
    resolveModalTitle(data, setModalTitle)
    setIsOpen(true)
  }

  const handleClusterClick = (clusterId: number) => {
    const leaves = supercluster.getLeaves(clusterId, Infinity)
    const photosInCluster = leaves
      .map((leaf: any) => leaf.properties?.data as IPhoto | undefined)
      .filter((photo): photo is IPhoto => Boolean(photo))
    setSelectedPhotos(photosInCluster)
    resolveModalTitle(photosInCluster, setModalTitle)
    setIsOpen(true)
  }

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 20,
          latitude: 50,
          zoom: 3.5,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="public/styles/dark_matter_edited.json"
        attributionControl={false}
        onMove={() => updateMapState(mapRef, setBounds, setZoom)}
        onLoad={() => {
          updateMapState(mapRef, setBounds, setZoom)

          if (targetLocation && !initialViewSet) {
            const map = mapRef.current?.getMap()
            if (map) {
              map.flyTo({
                center: [targetLocation.lng, targetLocation.lat],
                zoom: 12,
              })
              setInitialViewSet(true)
            }
          }
        }}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates
          const { cluster: isCluster, point_count: pointCount } = cluster.properties

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
                onClick={() => handleClusterClick(cluster.id)}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-sm border-2 border-border cursor-pointer bg-card">
                  {pointCount}
                </div>
              </Marker>
            )
          }

          return (
            <Marker key={`photo-${cluster.properties.photoId}`} longitude={longitude} latitude={latitude}>
              <img
                src={cluster.properties.photoUrl}
                alt="Photo marker"
                className="w-10 h-10 rounded-sm border-2 border-border cursor-pointer object-cover hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation() // prevent map click
                  handlePhotoClick(cluster.properties.photoId)
                }}
              />
            </Marker>
          )
        })}
      </Map>

      <PhotoModal isOpen={isOpen} setIsOpen={setIsOpen} selectedPhotos={selectedPhotos} title={modalTitle} />
    </>
  )
}

export default BaseMap
