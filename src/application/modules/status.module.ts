import { StatusController } from '@/application/controllers/status/status.controller'
import { CheckStatusUsecase } from '@/application/usecases/status/check-status.usecase'
import { Registry } from '@/infra/dependency-injection/registry'

export class StatusModule {
  constructor() {
    const registry = Registry.getInstance()
    registry.provide('checkStatusUsecase', new CheckStatusUsecase())
    new StatusController()
  }
}
