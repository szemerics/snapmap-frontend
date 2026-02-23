import { type MapRef } from "@vis.gl/react-maplibre"
import type { Dispatch, RefObject, SetStateAction } from "react"
import type { Bounds } from "./types"
import type { IPhoto } from "@/interfaces/IPhoto"

export function updateMapState(
  mapRef: RefObject<MapRef | null>,
  setBounds: Dispatch<SetStateAction<Bounds | null>>,
  setZoom: Dispatch<SetStateAction<number>>
) {
  const map = mapRef.current?.getMap()
  if (map) {
    const b = map.getBounds()
    setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()])
    setZoom(map.getZoom())
  }
}

export async function resolveModalTitle(
  photosInModal: IPhoto[],
  setModalTitle: Dispatch<SetStateAction<string>>
): Promise<void> {
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

    setModalTitle(`Photos near ${placeName}`)
  } catch {
    setModalTitle("Photos near this area")
  }
}
