import type { NextFunction, Request, Response } from 'express'

import type { Logger } from '@/domain/providers/logger/logger'
import { inject } from '@/infra/dependency-injection/registry'

export interface HttpLoggerHandler {
  handle: (req: Request, res: Response, next: NextFunction) => void
}

export class ExpressHttpLoggerHandler implements HttpLoggerHandler {
  @inject('logger')
  private readonly logger!: Logger

  handle(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      const message = `${req.method} ${req.ip} ${req.get('user-agent')} ${req.originalUrl} ${res.statusCode} ${duration}ms`
      this.logger.http(message)
    })
    next()
  }
}
