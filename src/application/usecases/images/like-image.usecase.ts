import { ImageNotFoundError } from '@/domain/errors/image.errors'
import { type ImageRepository } from '@/domain/repositories/image.repository'
import { inject } from '@/infra/dependency-injection/registry'
import type { IdType } from '@/infra/validates/id.validate'

export type LikeImageUsecaseInput = IdType

export class LikeImageUsecase {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute({ id }: LikeImageUsecaseInput): Promise<void> {
    const image = await this.imageRepository.findById(id)
    if (!image) throw new ImageNotFoundError()
    image.increaseLikes()
    await this.imageRepository.update({ id }, image)
  }
}
