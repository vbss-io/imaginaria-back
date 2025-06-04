import { ImagineGateways } from '@/domain/enums/images/imagine-gateways.enum'

export enum ImageAspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '16:9',
  PORTRAIT_WIDE = '9:16',
  LANDSCAPE_WIDE = '4:3',
  ULTRAWIDE = '21:9',
  ULTRAWIDE_PORTRAIT = '9:21'
}

export const imageAspectRatio = Object.values(ImageAspectRatio)

export const GatewayAspectRatioValidation = {
  [ImagineGateways.GO_API_MIDJOURNEY]: [
    ImageAspectRatio.SQUARE,
    ImageAspectRatio.LANDSCAPE,
    ImageAspectRatio.PORTRAIT_WIDE,
    ImageAspectRatio.LANDSCAPE_WIDE,
    ImageAspectRatio.PORTRAIT,
    ImageAspectRatio.ULTRAWIDE,
    ImageAspectRatio.ULTRAWIDE_PORTRAIT
  ],
  [ImagineGateways.OPEN_AI_DALLE3]: [
    ImageAspectRatio.SQUARE,
    ImageAspectRatio.PORTRAIT_WIDE,
    ImageAspectRatio.LANDSCAPE
  ]
} as const
