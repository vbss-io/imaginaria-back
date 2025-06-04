import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import { CustomError } from '@/domain/errors/custom-error'

export class InvalidAuthentication extends CustomError {
  constructor() {
    super(HttpStatusCodes.UNAUTHORIZED, 'invalid username or password')
  }
}

export class EmailNotConfirmed extends CustomError {
  constructor() {
    super(HttpStatusCodes.FORBIDDEN, 'email not confirmed')
  }
}

export class UserNotActive extends CustomError {
  constructor() {
    super(HttpStatusCodes.FORBIDDEN, 'user not active')
  }
}

export class UserNotAllowed extends CustomError {
  constructor() {
    super(HttpStatusCodes.FORBIDDEN, 'user not allowed')
  }
}

export class RegisterConflictError extends CustomError {
  constructor() {
    super(HttpStatusCodes.CONFLICT, 'email or username already exists')
  }
}

export class MissingAuthorizationToken extends CustomError {
  constructor() {
    super(HttpStatusCodes.UNAUTHORIZED, 'missing authorization token')
  }
}

export class RevokedAuthorizationToken extends CustomError {
  constructor() {
    super(HttpStatusCodes.UNAUTHORIZED, 'revoked authorization token')
  }
}

export class InvalidAuthorizationToken extends CustomError {
  constructor() {
    super(HttpStatusCodes.UNAUTHORIZED, 'invalid authorization token')
  }
}

export class AuthError extends CustomError {
  constructor(message: string) {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, message)
  }
}

export class DifferentPasswordAndConfirmation extends CustomError {
  constructor() {
    super(HttpStatusCodes.BAD_REQUEST, 'password and confirmPassword must be equals')
  }
}

export class UserAuthenticationError extends CustomError {
  constructor() {
    super(HttpStatusCodes.BAD_REQUEST, 'wrong username or password')
  }
}

export class NotAllowedError extends CustomError {
  constructor() {
    super(HttpStatusCodes.UNAUTHORIZED, 'Not Allowed Error')
  }
}

export class UserNotSet extends CustomError {
  constructor() {
    super(HttpStatusCodes.BAD_REQUEST, 'Cannot access user')
  }
}
