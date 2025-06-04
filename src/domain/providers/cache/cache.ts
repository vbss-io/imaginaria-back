export interface Cache {
  get: <T>(key: string) => T | null
  getMany: <T>(key: string) => T[]
  set: <T>(key: string, data: T, TTL: number) => void
  delete: (key: string) => void
  clear: () => void
}
