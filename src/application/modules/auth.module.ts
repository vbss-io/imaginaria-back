import { AuthController } from '@/application/controllers/auth/auth.controller'
import { LoginUsecase } from '@/application/usecases/auth/login.usecase'
import { SigninUsecase } from '@/application/usecases/auth/signin.usecase'
import { BcryptAdapter } from '@/infra/adapters/auth/bcrypt-adapter'
import { JWTAdapter } from '@/infra/adapters/auth/jwt-adapter'
import { ZodAdapter } from '@/infra/adapters/validate/zod-adapter'
import { Registry } from '@/infra/dependency-injection/registry'
import { RequestFacade } from '@/infra/facades/request.facade'
import { LoginSchema } from '@/infra/validates/auth/login.validate'
import { SigninSchema } from '@/infra/validates/auth/signin.validate'

export class AuthModule {
  constructor() {
    const registry = Registry.getInstance()
    registry.provide('tokenAuthentication', new JWTAdapter())
    registry.provide('requestFacade', new RequestFacade())
    registry.provide('passwordAuthentication', new BcryptAdapter())
    registry.provide('signinValidate', new ZodAdapter(SigninSchema))
    registry.provide('loginValidate', new ZodAdapter(LoginSchema))
    registry.provide('signinUsecase', new SigninUsecase())
    registry.provide('loginUsecase', new LoginUsecase())
    new AuthController()
  }
}
