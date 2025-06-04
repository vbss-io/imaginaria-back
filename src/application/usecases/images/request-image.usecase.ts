import { Image } from '@/domain/entities/image.entity'
import type { ImageStatus } from '@/domain/enums/images/image-status.enum'
import { GatewayModelName, GatewayOriginName } from '@/domain/enums/images/imagine-gateways.enum'
import type { DomainEvent } from '@/domain/events/domain-event'
import type { Queue } from '@/domain/providers/queue/queue'
import type { ImageRepository } from '@/domain/repositories/image.repository'
import { ImageDimensions } from '@/domain/vos/image-dimensions.vo'
import { inject } from '@/infra/dependency-injection/registry'
import type { RequestImageType } from '@/infra/validates/images/request-image.validate'

export type RequestImageUsecaseInput = RequestImageType & {
  authorId: string
}

export interface RequestImageUsecaseOutput {
  imageId: string
  status: ImageStatus
}

export class RequestImageUsecase {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('queue')
  private readonly queue!: Queue

  async execute({
    gateway,
    prompt,
    negativePrompt,
    aspectRatio,
    authorId
  }: RequestImageUsecaseInput): Promise<RequestImageUsecaseOutput> {
    const { width, height } = ImageDimensions.create(gateway, aspectRatio).getValues()
    const image = Image.create({
      width,
      height,
      aspectRatio,
      prompt,
      negativePrompt: negativePrompt ?? 'none',
      origin: GatewayOriginName[gateway],
      modelName: GatewayModelName[gateway],
      authorId
    })
    const createdImage = await this.imageRepository.create(image)
    createdImage.register(
      'imageRequested',
      async <ImageRequestedData>(domainEvent: DomainEvent<ImageRequestedData>) => {
        await this.queue.publish(domainEvent.eventName, domainEvent.data)
      }
    )
    await createdImage.request({ gateway })
    return {
      imageId: createdImage.id as string,
      status: createdImage.status
    }
  }
}
