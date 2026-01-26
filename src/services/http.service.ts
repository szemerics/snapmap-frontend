import axiosInstance from "@/services/api/axios.config"
import type { AxiosRequestConfig } from "axios"

export const HttpService = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((response) => response.data)
  },

  post<T>(
    url: string,
    data?: { [key: string]: any },
    config?: AxiosRequestConfig
    // callback?: CallableFunction
  ): Promise<T> {
    const promise = axiosInstance.post<T>(url, data, config).then((response) => response.data)

    return promise
  },

  put<T>(url: string, data?: { [key: string]: any }, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put<T>(url, data, config).then((response) => response.data)
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete(url, config).then((response) => response.data)
  },

  // post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  //   return axiosInstance.post<T>(url, data, config).then((response) => response.data)
  // }
}

// function processResponse(response: AxiosResponse) {
//   return response.data
// }

// async function processError(error: any) {
//   const response = error.response
//   let body: any = null
//   if (typeof response.data.text === "function") {
//     body = JSON.parse(await response.data.text())
//   } else {
//     body = response?.data
//   }

//   throw new Error(body?.message || "An unknown error occurred")
// }
