import jwt from 'jsonwebtoken'

import { JWT_EXPIRATION_TIME } from '@/domain/consts/timeouts.const'

export interface TokenAuthentication {
  encode: (input: object, secret?: string) => string
  decode: <T>(input: string, secret?: string) => T
}

export class JWTAdapter implements TokenAuthentication {
  encode(input: object, secret?: string): string {
    const jwtSecret = (secret ?? process.env.JWT_SECRET) as string
    return jwt.sign(input, jwtSecret, { expiresIn: JWT_EXPIRATION_TIME })
  }

  decode<T>(input: string, secret?: string): T {
    const jwtSecret = (secret ?? process.env.JWT_SECRET) as string
    return jwt.verify(input, jwtSecret) as T
  }
}
