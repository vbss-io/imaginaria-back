import type { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'
import { ZodError } from 'zod'

import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import { CustomError } from '@/domain/errors/custom-error'
import type { Logger } from '@/domain/providers/logger/logger'
import { inject } from '@/infra/dependency-injection/registry'

export interface ErrorHandler {
  handle: (err: Error, req: Request, res: Response, next: NextFunction) => Response
}

export class ExpressErrorHandler implements ErrorHandler {
  @inject('logger')
  private readonly logger!: Logger

  handle(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
    this.logger.error(err.message)
    if (err instanceof MulterError) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: `${err.message}: ${err.field}. Files must be files.` })
    }
    if (err instanceof ZodError) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: err.errors[0].message })
    }
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ message: err.message })
    }
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' })
  }
}
