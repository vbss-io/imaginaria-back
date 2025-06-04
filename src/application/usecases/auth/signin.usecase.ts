import { ONE_DAY } from '@/domain/consts/timeouts.const'
import { User } from '@/domain/entities/user.entity'
import { DifferentPasswordAndConfirmation } from '@/domain/errors/auth.errors'
import { UserAlreadyExist } from '@/domain/errors/user.errors'
import type { Cache } from '@/domain/providers/cache/cache'
import type { UserRepository } from '@/domain/repositories/user.repository'
import { FileUrl } from '@/domain/vos/file-url.vo'
import type { PasswordAuthentication } from '@/infra/adapters/auth/bcrypt-adapter'
import type { TokenAuthentication } from '@/infra/adapters/auth/jwt-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { SigninType } from '@/infra/validates/auth/signin.validate'

export type SigninUsecaseInput = SigninType

export interface SigninUsecaseOutput {
  token: string
  user: {
    id: string
    username: string
    role: string
    avatar?: string
  }
}

export class SigninUsecase {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('passwordAuthentication')
  private readonly passwordAuthentication!: PasswordAuthentication

  @inject('tokenAuthentication')
  private readonly tokenAuthentication!: TokenAuthentication

  @inject('cache')
  private readonly cache!: Cache

  async execute({ username, password, confirmPassword }: SigninUsecaseInput): Promise<SigninUsecaseOutput> {
    if (password !== confirmPassword) throw new DifferentPasswordAndConfirmation()
    const existingUser = await this.userRepository.findOne({ username })
    if (existingUser) throw new UserAlreadyExist()
    const hash = await this.passwordAuthentication.hash(password)
    const user = User.create({ username, hash, role: 'user' })
    const createdUser = await this.userRepository.create(user)
    const token = this.tokenAuthentication.encode(
      { id: createdUser.id, username: createdUser.username, role: createdUser.role },
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
