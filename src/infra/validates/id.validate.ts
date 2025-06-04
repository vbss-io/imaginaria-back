import { z } from 'zod'

export const IdSchema = z.object({
  id: z.string({
    required_error: 'id is required',
    invalid_type_error: 'id must be a string'
  })
})

export type IdType = z.infer<typeof IdSchema>
