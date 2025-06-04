import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import { CustomError } from '@/domain/errors/custom-error'

export class UserAlreadyExist extends CustomError {
  constructor() {
    super(HttpStatusCodes.CONFLICT, 'Username Already Exists')
  }
}

export class InvalidUserAvatarFile extends CustomError {
  constructor() {
    super(HttpStatusCodes.BAD_REQUEST, 'Profile avatar must be a image')
  }
}
