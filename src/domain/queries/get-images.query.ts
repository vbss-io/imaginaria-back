import type { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import type { GetImagesType } from '@/infra/validates/images/get-images.validate'

export type GetImagesQueryInput = GetImagesType & {
  authorId?: string
}

export interface GetImagesQueryOutput {
  total: number
  images: Array<{
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
  }>
}

export interface GetImagesQuery {
  execute: (input: GetImagesQueryInput) => Promise<GetImagesQueryOutput>
}
