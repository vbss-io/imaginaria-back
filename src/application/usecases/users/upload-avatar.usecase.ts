import { UserAuthenticationError } from '@/domain/errors/auth.errors'
import { InvalidUserAvatarFile } from '@/domain/errors/user.errors'
import type { FileStorage } from '@/domain/providers/storage/file-storage'
import type { UserRepository } from '@/domain/repositories/user.repository'
import type { CustomFile, FileConverter } from '@/domain/services/file-converter.service'
import { FileUrl } from '@/domain/vos/file-url.vo'
import { inject } from '@/infra/dependency-injection/registry'
import type { UploadAvatarType } from '@/infra/validates/users/upload-avatar.validate'

export type UploadAvatarUsecaseInput = UploadAvatarType & {
  userId: string
}

export interface UploadAvatarUsecaseOutput {
  path: string
}

export class UploadAvatarUsecase {
  @inject('userRepository')
  private readonly userRepository!: UserRepository

  @inject('fileConverterService')
  private readonly fileConverterService!: FileConverter

  @inject('fileStorage')
  private readonly fileStorage!: FileStorage

  async execute({ userId, files }: UploadAvatarUsecaseInput): Promise<UploadAvatarUsecaseOutput> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new UserAuthenticationError()
    if (user.avatar) await this.fileStorage.delete(user.avatar)
    const file = files[0] as CustomFile
    const [type, extension] = file.mimetype.split('/')
    if (type !== 'image') throw new InvalidUserAvatarFile()
    const base64 = this.fileConverterService.fileToBase64(file)
    const avatarPath = await this.fileStorage.uploadBase64(base64, extension)
    user.updateAvatar(avatarPath)
    await this.userRepository.update({ id: user.id }, user)
    return {
      path: FileUrl.create(avatarPath).getValue() as string
    }
  }
}
