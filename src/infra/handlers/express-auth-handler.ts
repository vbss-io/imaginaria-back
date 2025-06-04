import type { NextFunction, Request, Response } from 'express'

import { ONE_DAY } from '@/domain/consts/timeouts.const'
import {
    AuthError,
    InvalidAuthorizationToken,
    MissingAuthorizationToken,
    UserNotAllowed
} from '@/domain/errors/auth.errors'
import type { Cache } from '@/domain/providers/cache/cache'
import type { TokenAuthentication } from '@/infra/adapters/auth/jwt-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { RequestFacade } from '@/infra/facades/request.facade'
import type { UserAuth } from '@/infra/facades/user-auth.dto'

export interface AuthHandler {
  handle: (req: Request, res: Response, next: NextFunction) => Promise<void>
  handleAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export class ExpressAuthHandler implements AuthHandler {
  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  @inject('requestFacade')
  private readonly requestFacade!: RequestFacade

  @inject('cache')
  private readonly cache!: Cache

  async handle(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const { authorization } = req.headers
    const token = authorization?.replace('Bearer ', '')
    if (!token) throw new MissingAuthorizationToken()
    try {
      const user = this.tokenAuthentication.decode<UserAuth>(token, process.env.SECRET_KEY as string)
      const cacheKey = `auth:${user.id}`
      const cachedValue = this.cache.get<{ token: string }>(cacheKey)
      if (cachedValue?.token && cachedValue?.token !== token) throw new InvalidAuthorizationToken()
      this.cache.set(cacheKey, { token }, ONE_DAY)
      this.requestFacade.setUser(user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new AuthError(errorMessage)
    }
    next()
  }

  async handleAdmin(_req: Request, _res: Response, next: NextFunction): Promise<void> {
    const user = this.requestFacade.getUser()
    if (user?.role !== 'administrator') {
      throw new UserNotAllowed()
    }
    next()
  }
}
