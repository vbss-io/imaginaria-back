import type { ZodSchema } from 'zod'

export interface InputValidate<T> {
  validate: (value: T) => T
}

export class ZodAdapter<T> implements InputValidate<T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  validate(value: T): T {
    return this.schema.parse(value)
  }
}
