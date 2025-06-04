import type { Image } from '@/domain/entities/image.entity'
import type { BaseRepository } from '@/domain/repositories/base.repository'

export interface ImageRepository<T = unknown> extends BaseRepository<T, Image> {
  // getImagesByIds: (ids: string[]) => Promise<Image[] | []>
  // getRandomLandscapeImage: () => Promise<Image | undefined> // To Query
  toDomain(user: T): Image
}
