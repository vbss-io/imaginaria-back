import { ImageNotFoundError, ProcessImageError } from '@/domain/errors/image.errors'
import type { ImageRequestedData } from '@/domain/events/image-requested.event'
import type { FileStorage } from '@/domain/providers/storage/file-storage'
import type { ImageRepository } from '@/domain/repositories/image.repository'
import { inject } from '@/infra/dependency-injection/registry'
import { ImagineImageGatewayFactory } from '@/infra/factories/imagine-image-gateway.factory'

export type ProcessImageListenerInput = ImageRequestedData

export class ProcessImageListener {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('fileStorage')
  private readonly fileStorage!: FileStorage

  async execute({ imageId, gateway }: ProcessImageListenerInput): Promise<void> {
    const image = await this.imageRepository.findById(imageId)
    if (!image) throw new ImageNotFoundError()
    image.process()
    await this.imageRepository.update({ id: imageId }, image)
    const imagineImageGateway = ImagineImageGatewayFactory.create(gateway)
    const output = await imagineImageGateway.imagine({
      prompt: image.prompt,
      aspectRatio: image.aspectRatio,
      negativePrompt: image.negativePrompt
    })
    image.setGatewayTaskId(output?.taskId ?? 'none')
    if (output.errorMessage) {
      image.error(output.errorMessage)
      await this.imageRepository.update({ id: imageId }, image)
      throw new ProcessImageError(output.errorMessage)
    }
    const path = await this.fileStorage.uploadBase64(output.image, 'png')
    image.finish(path, output.seed)
    await this.imageRepository.update({ id: imageId }, image)
  }
}
