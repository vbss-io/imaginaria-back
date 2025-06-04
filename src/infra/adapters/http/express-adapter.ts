/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors'
import express, { type Application, type NextFunction, type Request, type RequestHandler, type Response } from 'express'
import multer from 'multer'

import type { HttpMethod } from '@/domain/enums/http/http-methods'
import { NotFoundError } from '@/domain/errors/catalog.errors'
import type { Logger } from '@/domain/providers/logger/logger'
import { inject } from '@/infra/dependency-injection/registry'
import type { AuthHandler } from '@/infra/handlers/express-auth-handler'
import type { ErrorHandler } from '@/infra/handlers/express-error-handler'
import type { HttpLoggerHandler } from '@/infra/handlers/express-http-logger-handler'

type RequestParams = any
type Headers = Record<string, string | string[] | undefined>
type CallbackResponse = Promise<Record<string, any> | void>
type RouteAccess = 'isPublic' | 'isPrivate' | 'isAdmin'
export type StreamResponse = Response

export interface HttpServer {
  register: (
    method: HttpMethod,
    url: string,
    callback: (params?: RequestParams, headers?: Headers) => CallbackResponse,
    code?: number,
    access?: RouteAccess
  ) => void
  start: (port?: number) => void
}

export class ExpressAdapter implements HttpServer {
  @inject('errorHandler')
  private readonly errorHandler!: ErrorHandler

  @inject('authHandler')
  private readonly authHandler!: AuthHandler

  @inject('httpLoggerHandler')
  private readonly httpLoggerHandler!: HttpLoggerHandler

  @inject('logger')
  private readonly logger!: Logger

  private readonly app: Application

  constructor() {
    this.app = express()
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(multer().array('files'))
    this.app.use(this.httpLoggerHandler.handle.bind(this.httpLoggerHandler))
  }

  register(
    method: HttpMethod,
    url: string,
    callback: (params?: RequestParams, headers?: Headers) => CallbackResponse,
    code = 200,
    access: RouteAccess = 'isPrivate'
  ): void {
    const handler: RequestHandler = async (req: Request, res: Response) => {
      const output = await callback({ ...req.params, ...req.query, ...req.body, files: req.files }, req.headers)
      res.status(code).json(output)
    }
    if (access === 'isPublic') {
      this.app[method](url, handler)
    } else if (access === 'isAdmin') {
      this.app[method](
        url,
        this.authHandler.handle.bind(this.authHandler),
        this.authHandler.handleAdmin.bind(this.authHandler),
        handler
      )
    } else {
      this.app[method](url, this.authHandler.handle.bind(this.authHandler), handler)
    }
  }

  start(port?: number): void {
    this.app.use(() => {
      throw new NotFoundError()
    })
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      this.errorHandler.handle(err, req, res, next)
    })
    this.app.listen(port, () => {
      this.logger.info(`Server started on PORT ${port}`)
    })
  }
}
