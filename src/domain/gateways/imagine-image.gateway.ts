import type { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'

export interface ImagineImageGatewayInput {
  prompt: string
  aspectRatio: ImageAspectRatio
  negativePrompt?: string
}

export interface ImagineImageGatewayOutput {
  image: string
  seed: number
  taskId?: string
  errorMessage?: string
}

export interface ImagineImageGateway {
  imagine: (input: ImagineImageGatewayInput) => Promise<ImagineImageGatewayOutput>
}
