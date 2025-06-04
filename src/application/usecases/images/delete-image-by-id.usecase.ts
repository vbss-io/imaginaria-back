import { ImageNotFoundError } from '@/domain/errors/image.errors'
import type { FileStorage } from '@/domain/providers/storage/file-storage'
import type { ImageRepository } from '@/domain/repositories/image.repository'
import { inject } from '@/infra/dependency-injection/registry'
import type { IdType } from '@/infra/validates/id.validate'

export type DeleteImageByUsecaseIdInput = IdType & {
  userId: string
}

export class DeleteImageByIdUsecase {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('fileStorage')
  private readonly fileStorage!: FileStorage

  async execute({ id, userId }: DeleteImageByUsecaseIdInput): Promise<void> {
    const image = await this.imageRepository.findById(id)
    if (!image) throw new ImageNotFoundError()
    if (image.authorId !== userId) throw new Error('Not allowed to delete Image')
    await this.imageRepository.delete({ id })
    if (image.path) await this.fileStorage.delete(image.path)
  }
}
