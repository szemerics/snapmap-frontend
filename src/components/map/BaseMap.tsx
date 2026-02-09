import type { IPhoto } from "@/interfaces/IPhoto"
import { Map, Marker, type MapRef } from "@vis.gl/react-maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useState, useRef, useMemo } from "react"
import Supercluster from "supercluster" // 1. Import Supercluster
import PhotoModal from "./PhotoModal"
import { photoService } from "@/services/photo.service"

const BaseMap = () => {
  // 2. Create a ref to access the map instance (needed for bounds/zoom)
  const mapRef = useRef<MapRef>(null)

  const [photos, setPhotos] = useState<IPhoto[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<IPhoto[]>([])
  const [modalTitle, setModalTitle] = useState("Photos near this area")
  const titleRequestIdRef = useRef(0)

  // 3. State for the visible clusters/points
  const [clusters, setClusters] = useState<any[]>([])
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null)
  const [zoom, setZoom] = useState(3.5)

  useEffect(() => {
    async function fetchPhotos() {
      const data = await photoService.getPhotos<IPhoto[]>({ photo_type: "map" })
      setPhotos(data)
    }
    fetchPhotos()
  }, [])

  // 4. Transform photos into GeoJSON points for Supercluster
  const points = useMemo(() => {
    return photos.map((p) => ({
      type: "Feature",
      properties: { cluster: false, photoId: p.id, photoUrl: p.photo_url, data: p },
      geometry: {
        type: "Point",
        coordinates: [p.location!.lng, p.location!.lat],
      },
    }))
  }, [photos])

  // 5. Initialize Supercluster
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 40, // Cluster radius in pixels
      maxZoom: 16, // Max zoom to cluster points on
    })
    sc.load(points as any)
    return sc
  }, [points])

  // 6. Update clusters when map moves or data loads
  useEffect(() => {
    if (bounds) {
      const newClusters = supercluster.getClusters(bounds, zoom)
      setClusters(newClusters)
    }
  }, [points, bounds, zoom, supercluster])

  // Helper: Update bounds/zoom state on map move
  const updateMapState = () => {
    const map = mapRef.current?.getMap()
    if (map) {
      const b = map.getBounds()
      setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()])
      setZoom(map.getZoom())
    }
  }

  const handlePhotoClick = async (photo_id: string) => {
    const data = await photoService.getPhotos<IPhoto[]>({ photo_id })
    setSelectedPhotos(data)
    void resolveModalTitle(data)
    setIsOpen(true)
  }

  // 7. Handle click on a cluster (Open grouped posts)
  const handleClusterClick = (clusterId: number) => {
    const leaves = supercluster.getLeaves(clusterId, Infinity)
    const photosInCluster = leaves
      .map((leaf: any) => leaf.properties?.data as IPhoto | undefined)
      .filter((photo): photo is IPhoto => Boolean(photo))
    setSelectedPhotos(photosInCluster)
    void resolveModalTitle(photosInCluster)
    setIsOpen(true)
  }

  const resolveModalTitle = async (photosInModal: IPhoto[]) => {
    const requestId = ++titleRequestIdRef.current
    setModalTitle("Photos near this area")

    const validLocations = photosInModal
      .map((photo) => photo.location)
      .filter((location): location is NonNullable<IPhoto["location"]> => Boolean(location))

    if (validLocations.length === 0) {
      return
    }

    const { lat, lng } = validLocations.reduce(
      (acc, location) => ({
        lat: acc.lat + location.lat,
        lng: acc.lng + location.lng,
      }),
      { lat: 0, lng: 0 }
    )

    const centerLat = lat / validLocations.length
    const centerLng = lng / validLocations.length

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${centerLat}&lon=${centerLng}&zoom=10&addressdetails=1&accept-language=en`
      )

      if (!response.ok) {
        return
      }

      const data = await response.json()
      const address = data?.address || {}
      const placeName =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        address.state ||
        address.country

      if (requestId === titleRequestIdRef.current && placeName) {
        setModalTitle(`Photos near ${placeName}`)
      }
    } catch {
      // No-op: keep fallback title
    }
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
        // 8. Hook into the onMove event
        onMove={updateMapState}
        onLoad={updateMapState}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates
          const { cluster: isCluster, point_count: pointCount } = cluster.properties

          if (isCluster) {
            // -- RENDER CLUSTER --
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

          // -- RENDER SINGLE PHOTO --
          return (
            <Marker key={`photo-${cluster.properties.photoId}`} longitude={longitude} latitude={latitude}>
              <img
                src={cluster.properties.photoUrl}
                alt="Photo marker"
                className="w-10 h-10 rounded-sm border-2 border-border cursor-pointer object-cover hover:scale-110 transition-transform"
                onClick={(e) => {
                  e.stopPropagation() // Prevent map click
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
