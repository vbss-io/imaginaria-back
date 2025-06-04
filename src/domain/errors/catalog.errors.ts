import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import { CustomError } from '@/domain/errors/custom-error'

export class NotFoundError extends CustomError {
  constructor() {
    super(HttpStatusCodes.NOT_FOUND, 'Not Found')
  }
}

export class NotImplemented extends CustomError {
  constructor() {
    super(HttpStatusCodes.NOT_FOUND, 'Not Implemented')
  }
}

export class DatabaseConnectionError extends CustomError {
  constructor() {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Database Connection Error')
  }
}

export class DatabaseConnectionCloseError extends CustomError {
  constructor() {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Database Connection Close Error')
  }
}

export class DatabaseEntityNotFound extends CustomError {
  constructor() {
    super(HttpStatusCodes.NOT_FOUND, 'entity not found')
  }
}

export class QueueConnectionError extends CustomError {
  constructor() {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Queue Connection Error')
  }
}

export class GatewayNotImplemented extends CustomError {
  constructor() {
    super(HttpStatusCodes.NOT_FOUND, 'Gateway Not Implemented')
  }
}
