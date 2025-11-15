import axiosInstance from './axios.config'
import type { IPhoto } from '../interfaces/IPhoto'

const Photos = {
  getPhotos: () => axiosInstance.get<IPhoto[]>('/photos')
}

const api = {
  Photos
}

export default api