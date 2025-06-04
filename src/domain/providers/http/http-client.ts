type Headers = Record<string, string | string[] | undefined>
type RequestParams = unknown
type RequestBody = unknown

export interface HttpClientGetInput {
  url: string
  params?: RequestParams
  headers?: Headers
  responseType?: string
}

export interface HttpClientPostInput {
  url: string
  body: RequestBody
  params?: RequestParams
  headers?: Headers
}

export interface HttpClient {
  get: <T>({ url, params, headers, responseType }: HttpClientGetInput) => Promise<T>
  post: <T>({ url, body, params, headers }: HttpClientPostInput) => Promise<T>
  put: <T>({ url, body, params, headers }: HttpClientPostInput) => Promise<T>
  patch: <T>({ url, body, params, headers }: HttpClientPostInput) => Promise<T>
  delete: <T>({ url, params, headers }: HttpClientGetInput) => Promise<T>
}
