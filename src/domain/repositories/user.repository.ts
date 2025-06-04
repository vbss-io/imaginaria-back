import type { User } from '@/domain/entities/user.entity'
import type { BaseRepository } from '@/domain/repositories/base.repository'

export interface UserRepository<T = unknown> extends BaseRepository<T, User> {
  toDomain(user: T): User
}
