import { z } from 'zod'

import { GatewayAspectRatioValidation, ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import { ImagineGateways } from '@/domain/enums/images/imagine-gateways.enum'

export const RequestImageSchema = z
  .object({
    gateway: z.nativeEnum(ImagineGateways, {
      required_error: 'gateway is required'
    }),
    prompt: z.string({
      required_error: 'prompt is required',
      invalid_type_error: 'prompt must be a string'
    }),
    negativePrompt: z
      .string({
        invalid_type_error: 'negativePrompt must be a string'
      })
      .optional(),
    aspectRatio: z.nativeEnum(ImageAspectRatio, {
      required_error: 'aspectRatio is required',
      invalid_type_error: 'aspectRatio must be a valid aspect ratio'
    })
  })
  .superRefine((data, ctx) => {
    const validAspectRatios = GatewayAspectRatioValidation[data.gateway] as readonly ImageAspectRatio[]
    if (!validAspectRatios.includes(data.aspectRatio)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid aspect ratio for ${data.gateway}. Valid ratios are: ${validAspectRatios.join(', ')}`
      })
    }
  })

export type RequestImageType = z.infer<typeof RequestImageSchema>
