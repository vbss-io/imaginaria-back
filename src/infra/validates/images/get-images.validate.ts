import { z } from 'zod'

import { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import { ImageStatus } from '@/domain/enums/images/image-status.enum'

export const GetImagesSchema = z.object({
  searchMask: z.string().optional(),
  status: z
    .nativeEnum(ImageStatus, {
      invalid_type_error: 'status must be one of the following: queued, processing, error, processed'
    })
    .optional(),
  origin: z.string().optional(),
  modelName: z.string().optional(),
  aspectRatio: z.nativeEnum(ImageAspectRatio).optional(),
  orderBy: z.enum(['createdAt', 'likes']).optional(),
  orderByDirection: z.enum(['ASC', 'DESC']).optional(),
  page: z
    .number({
      required_error: 'page is required',
      invalid_type_error: 'page must be a number'
    })
    .min(1)
    .default(1),
  rowsPerPage: z
    .number({
      required_error: 'rowsPerPage is required',
      invalid_type_error: 'rowsPerPage must be a number'
    })
    .min(1)
    .default(25)
})

export type GetImagesType = z.infer<typeof GetImagesSchema>
