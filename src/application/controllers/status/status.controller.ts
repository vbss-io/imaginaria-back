import { BaseController } from '@/application/controllers/base.controller'
import type { CheckStatusUsecase } from '@/application/usecases/status/check-status.usecase'
import { HttpMethod } from '@/domain/enums/http/http-methods'
import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import { inject } from '@/infra/dependency-injection/registry'

export class StatusController extends BaseController {
  @inject('checkStatusUsecase')
  private readonly checkStatusUsecase!: CheckStatusUsecase

  constructor() {
    super()

    this.httpServer.register(
      HttpMethod.GET,
      '/status',
      async () => {
        return await this.checkStatusUsecase.execute()
      },
      HttpStatusCodes.OK,
      'isPublic'
    )
  }
}
