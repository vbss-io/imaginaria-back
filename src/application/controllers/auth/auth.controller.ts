import { BaseController } from '@/application/controllers/base.controller'
import type { LoginUsecase } from '@/application/usecases/auth/login.usecase'
import type { SigninUsecase } from '@/application/usecases/auth/signin.usecase'
import { HttpMethod } from '@/domain/enums/http/http-methods'
import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import type { InputValidate } from '@/infra/adapters/validate/zod-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { LoginType } from '@/infra/validates/auth/login.validate'
import type { SigninType } from '@/infra/validates/auth/signin.validate'

export class AuthController extends BaseController {
  @inject('signinValidate')
  private readonly signinValidate!: InputValidate<SigninType>

  @inject('signinUsecase')
  private readonly signinUsecase!: SigninUsecase

  @inject('loginValidate')
  private readonly loginValidate!: InputValidate<LoginType>

  @inject('loginUsecase')
  private readonly loginUsecase!: LoginUsecase

  constructor() {
    super()

    this.httpServer.register(
      HttpMethod.POST,
      '/sign_in',
      async (params: SigninType) => {
        const inputParsed = this.signinValidate.validate(params)
        return await this.signinUsecase.execute(inputParsed)
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    this.httpServer.register(
      HttpMethod.POST,
      '/login',
      async (params: LoginType) => {
        const inputParsed = this.loginValidate.validate(params)
        return await this.loginUsecase.execute(inputParsed)
      },
      HttpStatusCodes.OK,
      'isPublic'
    )
  }
}
