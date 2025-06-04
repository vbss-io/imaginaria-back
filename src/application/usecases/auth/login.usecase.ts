import { ONE_DAY } from '@/domain/consts/timeouts.const'
import { UserAuthenticationError } from '@/domain/errors/auth.errors'
import type { Cache } from '@/domain/providers/cache/cache'
import type { UserRepository } from '@/domain/repositories/user.repository'
import { FileUrl } from '@/domain/vos/file-url.vo'
import type { PasswordAuthentication } from '@/infra/adapters/auth/bcrypt-adapter'
import type { TokenAuthentication } from '@/infra/adapters/auth/jwt-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { LoginType } from '@/infra/validates/auth/login.validate'

export type LoginUsecaseInput = LoginType

export interface LoginUsecaseOutput {
  token: string
  user: {
    id: string
    username: string
    role: string
    avatar?: string
  }
}

export class LoginUsecase {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('passwordAuthentication')
  private readonly passwordAuthentication!: PasswordAuthentication

  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  @inject('cache')
  private readonly cache!: Cache

  async execute({ username, password }: LoginUsecaseInput): Promise<LoginUsecaseOutput> {
    const user = await this.userRepository.findOne({ username })
    if (!user) throw new UserAuthenticationError()
    const passwordMatch = await this.passwordAuthentication.compare(password, user.hash)
    if (!passwordMatch) throw new UserAuthenticationError()
    const token = this.tokenAuthentication.encode(
      { id: user.id, username: user.username, role: user.role },
      process.env.SECRET_KEY as string
    )
    this.cache.set(`auth:${user.id}`, { token }, ONE_DAY)
    return {
      token,
      user: {
        id: user.id as string,
        username: user.username,
        role: user.role,
        avatar: FileUrl.create(user.avatar).getValue()
      }
    }
  }
}
