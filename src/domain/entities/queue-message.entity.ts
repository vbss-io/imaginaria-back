import { QueueMessageStatus } from '@/domain/enums/queue/queue-message-status.enum'

export class QueueMessage<T> {
  status: QueueMessageStatus
  attempts: number
  errorMessage?: string
  lastAttempt?: Date
  createdAt: Date
  delay?: number

  private constructor(
    readonly id: string | number | undefined,
    readonly data: T,
    status: QueueMessageStatus,
    attempts: number,
    errorMessage?: string,
    lastAttempt?: Date,
    createdAt: Date = new Date(),
    delay?: number
  ) {
    this.status = status
    this.attempts = attempts
    this.errorMessage = errorMessage
    this.lastAttempt = lastAttempt
    this.createdAt = createdAt
    this.delay = delay
  }

  static create<T>(input: QueueMessageCreate<T>): QueueMessage<T> {
    return new QueueMessage(
      crypto.randomUUID(),
      input.data,
      QueueMessageStatus.PENDING,
      0,
      undefined,
      undefined,
      new Date(),
      input.delay
    )
  }

  static restore<T>(input: QueueMessageRestore<T>): QueueMessage<T> {
    return new QueueMessage(
      input.id,
      input.data,
      input.status,
      input.attempts,
      input.errorMessage,
      input.lastAttempt,
      input.createdAt,
      input.delay
    )
  }

  process(): void {
    this.status = QueueMessageStatus.PROCESSING
    this.attempts = this.attempts + 1
    this.errorMessage = undefined
    this.lastAttempt = new Date()
  }

  complete(): void {
    this.status = QueueMessageStatus.DONE
    this.errorMessage = undefined
  }

  error(errorMessage: string): void {
    this.status = QueueMessageStatus.ERROR
    this.errorMessage = errorMessage
  }
}

export interface QueueMessageCreate<T> {
  data: T
  delay?: number
}

export type QueueMessageRestore<T> = QueueMessageCreate<T> & {
  id: string | number
  status: QueueMessageStatus
  attempts: number
  errorMessage?: string
  lastAttempt?: Date
  createdAt: Date
  updatedAt: Date
}
