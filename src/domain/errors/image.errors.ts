import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import { CustomError } from '@/domain/errors/custom-error'

export class ProcessImageError extends CustomError {
  constructor(message: string) {
    super(HttpStatusCodes.BAD_REQUEST, message)
  }
}

export class ImageNotFoundError extends CustomError {
  constructor() {
    super(HttpStatusCodes.NOT_FOUND, 'Image Not found')
  }
}

export class DalleDimensionsError extends CustomError {
  constructor() {
    super(HttpStatusCodes.BAD_REQUEST, 'Dalle 3 aspectRatios allowed: 1:1, 9:16, 16:9')
  }
}

export class MidjourneyDimensionsError extends CustomError {
  constructor() {
    super(HttpStatusCodes.BAD_REQUEST, 'Midjourney aspectRatios allowed: 1:1, 9:16, 16:9')
  }
}
