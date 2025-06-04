import type { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import { ImageStatus } from '@/domain/enums/images/image-status.enum'
import { ImageRequested, type ImageRequestedData } from '@/domain/events/image-requested.event'
import { Observable } from '@/infra/events/observer'

export class Image extends Observable {
  id: string | undefined
  status: ImageStatus
  path: string | undefined
  likes: number
  tags: string[]
  seed?: number
  errorMessage?: string
  gatewayTaskId?: string

  private constructor(
    id: string | undefined,
    status: ImageStatus,
    readonly width: number,
    readonly height: number,
    readonly aspectRatio: ImageAspectRatio,
    path: string | undefined,
    readonly prompt: string,
    readonly negativePrompt: string,
    readonly origin: string,
    readonly modelName: string,
    likes: number,
    tags: string[],
    readonly authorId: string,
    seed?: number,
    errorMessage?: string,
    gatewayTaskId?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    super()
    this.id = id
    this.status = status
    this.path = path
    this.likes = likes
    this.tags = tags
    this.seed = seed
    this.errorMessage = errorMessage
    this.gatewayTaskId = gatewayTaskId
  }

  static create(input: ImageCreate): Image {
    return new Image(
      undefined,
      ImageStatus.QUEUED,
      input.width,
      input.height,
      input.aspectRatio,
      undefined,
      input.prompt,
      input.negativePrompt,
      input.origin,
      input.modelName,
      0,
      [],
      input.authorId
    )
  }

  static restore(input: ImageRestore): Image {
    return new Image(
      input.id,
      input.status,
      input.width,
      input.height,
      input.aspectRatio,
      input.path,
      input.prompt,
      input.negativePrompt,
      input.origin,
      input.modelName,
      input.likes,
      input.tags,
      input.authorId,
      input.seed,
      input.errorMessage,
      input.gatewayTaskId,
      input.createdAt,
      input.updatedAt
    )
  }

  async request({ gateway }: Omit<ImageRequestedData, 'imageId'>): Promise<void> {
    await this.notify(new ImageRequested({ imageId: this.id as string, gateway }))
  }

  process(): void {
    this.status = ImageStatus.PROCESSING
  }

  error(message: string): void {
    this.errorMessage = message
    this.status = ImageStatus.ERROR
  }

  finish(path: string, seed: number): void {
    this.path = path
    this.seed = seed
    this.status = ImageStatus.PROCESSED
  }

  setGatewayTaskId(id: string): void {
    this.gatewayTaskId = id
  }

  increaseLikes(): void {
    this.likes = this.likes + 1
  }

  decreaseLikes(): void {
    if (this.likes === 0) return
    this.likes = this.likes - 1
  }
}

export interface ImageCreate {
  width: number
  height: number
  aspectRatio: ImageAspectRatio
  prompt: string
  negativePrompt: string
  origin: string
  modelName: string
  authorId: string
}

export type ImageRestore = ImageCreate & {
  id: string
  status: ImageStatus
  path?: string
  likes: number
  tags: string[]
  seed?: number
  errorMessage?: string
  gatewayTaskId?: string
  createdAt: Date
  updatedAt: Date
}
