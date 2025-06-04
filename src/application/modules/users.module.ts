import { UsersController } from '@/application/controllers/users/users.controller'
import { RemoveAvatarUsecase } from '@/application/usecases/users/remove-avatar.usecase'
import { UploadAvatarUsecase } from '@/application/usecases/users/upload-avatar.usecase'
import { ZodAdapter } from '@/infra/adapters/validate/zod-adapter'
import { UserRepositoryMongoose } from '@/infra/database/repositories/user.repository'
import { Registry } from '@/infra/dependency-injection/registry'
import { UploadAvatarSchema } from '@/infra/validates/users/upload-avatar.validate'

export class UsersModule {
  constructor() {
    const registry = Registry.getInstance()
    registry.provide('userRepository', new UserRepositoryMongoose())
    Registry.getInstance().provide('uploadAvatarValidate', new ZodAdapter(UploadAvatarSchema))
    Registry.getInstance().provide('uploadAvatarUsecase', new UploadAvatarUsecase())
    Registry.getInstance().provide('removeAvatarUsecase', new RemoveAvatarUsecase())
    new UsersController()
  }
}
