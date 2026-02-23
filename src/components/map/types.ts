import type { IPhoto } from "@/interfaces/IPhoto"

export type GeoJSON = {
  type: string
  properties: {
    cluster: boolean
    photoId: string
    photoUrl: string
    data: IPhoto
  }
  geometry: {
    type: string
    coordinates: number[]
  }
}

export type Bounds = [number, number, number, number]
