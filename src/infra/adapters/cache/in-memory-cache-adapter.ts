import type { Cache } from '@/domain/providers/cache/cache';

export class InMemoryCacheAdapter implements Cache {
  private static instance: Cache
  private readonly cache: Map<string, { data: unknown; timestamp: number; TTL: number }>

  private constructor() {
    this.cache = new Map()
  }

  static getInstance(): Cache {
    if (!InMemoryCacheAdapter.instance) {
      InMemoryCacheAdapter.instance = new InMemoryCacheAdapter()
    }
    return InMemoryCacheAdapter.instance
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key) as { data: T; timestamp: number; TTL: number } | undefined
    if (!cached) return null
    if (Date.now() - cached.timestamp > cached.TTL) {
      this.cache.delete(key)
      return null
    }
    return cached.data
  }

  getMany<T>(key: string): T[] {
    const results: T[] = []
    for (const [cacheKey, cached] of this.cache.entries()) {
      if (cacheKey.startsWith(key)) {
        if (Date.now() - cached.timestamp > cached.TTL) {
          this.cache.delete(cacheKey)
          continue
        }
        results.push(cached.data as T)
      }
    }
    return results
  }

  set<T>(key: string, data: T, TTL: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      TTL
    })
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }
}
