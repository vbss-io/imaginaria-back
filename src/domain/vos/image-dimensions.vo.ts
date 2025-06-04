import { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import { ImagineGateways } from '@/domain/enums/images/imagine-gateways.enum'

export class ImageDimensions {
  private readonly width: number
  private readonly height: number

  private constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  static create(gateway: ImagineGateways, aspectRatio: ImageAspectRatio): ImageDimensions {
    const dimensions = this.getDimensionsForGateway(gateway, aspectRatio)
    return new ImageDimensions(dimensions.width, dimensions.height)
  }

  private static getDimensionsForGateway(
    gateway: ImagineGateways,
    aspectRatio: ImageAspectRatio
  ): { width: number; height: number } {
    switch (gateway) {
      case ImagineGateways.GO_API_MIDJOURNEY:
        return this.getMidjourneyDimensions(aspectRatio)
      case ImagineGateways.OPEN_AI_DALLE3:
        return this.getDalle3Dimensions(aspectRatio)
      default:
        throw new Error(`Unsupported gateway: ${gateway}`)
    }
  }

  private static getMidjourneyDimensions(aspectRatio: ImageAspectRatio): { width: number; height: number } {
    const dimensions: Record<ImageAspectRatio, { width: number; height: number }> = {
      [ImageAspectRatio.SQUARE]: { width: 1024, height: 1024 },
      [ImageAspectRatio.LANDSCAPE]: { width: 1456, height: 816 },
      [ImageAspectRatio.PORTRAIT_WIDE]: { width: 816, height: 1456 },
      [ImageAspectRatio.LANDSCAPE_WIDE]: { width: 1232, height: 928 },
      [ImageAspectRatio.PORTRAIT]: { width: 928, height: 1232 },
      [ImageAspectRatio.ULTRAWIDE]: { width: 1680, height: 720 },
      [ImageAspectRatio.ULTRAWIDE_PORTRAIT]: { width: 720, height: 1680 }
    }

    return dimensions[aspectRatio]
  }

  private static getDalle3Dimensions(aspectRatio: ImageAspectRatio): { width: number; height: number } {
    const dimensions: Partial<Record<ImageAspectRatio, { width: number; height: number }>> = {
      [ImageAspectRatio.SQUARE]: { width: 1024, height: 1024 },
      [ImageAspectRatio.LANDSCAPE]: { width: 1792, height: 1024 },
      [ImageAspectRatio.PORTRAIT_WIDE]: { width: 1024, height: 1792 }
    }

    const result = dimensions[aspectRatio]
    if (!result) {
      throw new Error(`Unsupported aspect ratio ${aspectRatio} for DALL-E 3`)
    }

    return result
  }

  getValues(): { width: number; height: number } {
    return { width: this.width, height: this.height }
  }
}
