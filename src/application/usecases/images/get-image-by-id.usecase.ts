import type { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import { ImageNotFoundError } from '@/domain/errors/image.errors'
import type { ImageRepository } from '@/domain/repositories/image.repository'
import type { UserRepository } from '@/domain/repositories/user.repository'
import { FileUrl } from '@/domain/vos/file-url.vo'
import { inject } from '@/infra/dependency-injection/registry'
import type { IdType } from '@/infra/validates/id.validate'

export type GetImageByIdUsecaseInput = IdType

export interface GetImageByIdUsecaseOutput {
  id: string
  status: string
  width: number
  height: number
  aspectRatio: ImageAspectRatio
  path?: string
  prompt: string
  negativePrompt: string
  origin: string
  modelName: string
  likes: number
  tags: string[]
  seed?: number
  errorMessage?: string
  gatewayTaskId?: string
  createdAt?: Date
  author: {
    id: string
    name?: string
    avatar?: string
  }
}

export class GetImageByIdUsecase {
  @inject('imageRepository')
  private readonly imageRepository!: ImageRepository

  @inject('userRepository')
  private readonly userRepository!: UserRepository

  async execute({ id }: GetImageByIdUsecaseInput): Promise<GetImageByIdUsecaseOutput> {
    const image = await this.imageRepository.findById(id)
    if (!image) throw new ImageNotFoundError()
    const author = await this.userRepository.findById(image.authorId)
    return {
      id: image.id as string,
      status: image.status,
      width: image.width,
      height: image.height,
      aspectRatio: image.aspectRatio,
      path: FileUrl.create(image.path).getValue(),
      prompt: image.prompt,
      negativePrompt: image.negativePrompt,
      origin: image.origin,
      modelName: image.modelName,
      likes: image.likes,
      tags: image.tags,
      seed: image.seed,
      errorMessage: image.errorMessage,
      gatewayTaskId: image.gatewayTaskId,
      createdAt: image.createdAt,
      author: {
        id: author?.id as string,
        name: author?.username,
        avatar: FileUrl.create(author?.avatar).getValue()
      }
    }
  }
}
