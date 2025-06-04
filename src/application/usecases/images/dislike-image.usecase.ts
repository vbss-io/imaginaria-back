import { ImageNotFoundError } from '@/domain/errors/image.errors'
import { type ImageRepository } from '@/domain/repositories/image.repository'
import { inject } from '@/infra/dependency-injection/registry'
import type { IdType } from '@/infra/validates/id.validate'

export type DislikeImageUsecaseInput = IdType

export class DislikeImageUsecase {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  async execute({ id }: DislikeImageUsecaseInput): Promise<void> {
    const image = await this.imageRepository.findById(id)
    if (!image) throw new ImageNotFoundError()
    image.decreaseLikes()
    await this.imageRepository.update({ id }, image)
  }
}
