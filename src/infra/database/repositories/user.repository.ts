import { User } from '@/domain/entities/user.entity'
import type { UserRepository } from '@/domain/repositories/user.repository'
import { BaseRepositoryMongoose } from '@/infra/database/repositories/@base.repository'
import { UserModel, type UserDocument } from '@/infra/database/schemas/user.schema'

export class UserRepositoryMongoose
  extends BaseRepositoryMongoose<UserDocument, User>
  implements UserRepository<UserDocument>
{
  constructor(model = UserModel) {
    super(model)
  }

  toDomain(entity: UserDocument): User {
    return User.restore({
      id: entity._id.toString(),
      username: entity.username,
      hash: entity.hash,
      role: entity.role,
      avatar: entity.avatar,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })
  }
}
