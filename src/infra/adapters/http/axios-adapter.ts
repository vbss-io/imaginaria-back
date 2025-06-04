import axios from 'axios'

import {
    type HttpClient,
    type HttpClientGetInput,
    type HttpClientPostInput
} from '@/domain/providers/http/http-client'

axios.defaults.validateStatus = function (): boolean {
  return true
}

export class AxiosAdapter implements HttpClient {
  async get<T>({ url, params = {}, headers = {}, responseType }: HttpClientGetInput): Promise<T> {
    const options = { params, headers }
    if (responseType) Object.assign(options, { responseType })
    const response = await axios.get(url, options)
    return response.data as T
  }

  async post<T>({ url, body, params = {}, headers = {} }: HttpClientPostInput): Promise<T> {
    const response = await axios.post(url, body, { params, headers })
    return response.data as T
  }

  async put<T>({ url, body, params = {}, headers = {} }: HttpClientPostInput): Promise<T> {
    const response = await axios.put(url, body, { params, headers })
    return response.data as T
  }

  async patch<T>({ url, body, params = {}, headers = {} }: HttpClientPostInput): Promise<T> {
    const response = await axios.patch(url, body, { params, headers })
    return response.data as T
  }

  async delete<T>({ url, params = {}, headers = {} }: HttpClientGetInput): Promise<T> {
    const response = await axios.delete(url, { params, headers })
    return response.data as T
  }
}
