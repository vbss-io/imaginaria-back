import { UserAuthenticationError } from '@/domain/errors/auth.errors'
import type { FileStorage } from '@/domain/providers/storage/file-storage'
import type { UserRepository } from '@/domain/repositories/user.repository'
import { inject } from '@/infra/dependency-injection/registry'

export interface RemoveAvatarUsecaseInput {
  userId: string
}

export class RemoveAvatarUsecase {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('fileStorage')
  private readonly fileStorage!: FileStorage

  async execute({ userId }: RemoveAvatarUsecaseInput): Promise<void> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new UserAuthenticationError()
    if (user.avatar) {
      await this.fileStorage.delete(user.avatar)
    }
    user.updateAvatar('')
    await this.userRepository.update({ id: user.id }, user)
  }
}
