import { BaseController } from '@/application/controllers/base.controller'
import { type RemoveAvatarUsecase } from '@/application/usecases/users/remove-avatar.usecase'
import { type UploadAvatarUsecase } from '@/application/usecases/users/upload-avatar.usecase'
import { HttpMethod } from '@/domain/enums/http/http-methods'
import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import type { InputValidate } from '@/infra/adapters/validate/zod-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { UploadAvatarType } from '@/infra/validates/users/upload-avatar.validate'

export class UsersController extends BaseController {
  @inject('uploadAvatarValidate')
  private readonly uploadAvatarValidate!: InputValidate<UploadAvatarType>

  @inject('uploadAvatarUsecase')
  private readonly uploadAvatarUsecase!: UploadAvatarUsecase

  @inject('removeAvatarUsecase')
  private readonly removeAvatarUsecase!: RemoveAvatarUsecase

  constructor() {
    super()

    this.httpServer.register(
      HttpMethod.PATCH,
      '/user/avatar',
      async (params: UploadAvatarType) => {
        const { id } = this.requestFacade.getUser()
        const inputParsed = this.uploadAvatarValidate.validate(params)
        return await this.uploadAvatarUsecase.execute({ ...inputParsed, userId: id })
      },
      HttpStatusCodes.OK
    )

    this.httpServer.register(
      HttpMethod.DELETE,
      '/user/avatar',
      async () => {
        const { id } = this.requestFacade.getUser()
        await this.removeAvatarUsecase.execute({ userId: id })
      },
      HttpStatusCodes.OK
    )
  }
}
