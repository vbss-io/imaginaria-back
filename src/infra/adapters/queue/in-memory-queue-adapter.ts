import { ONE_SECOND } from '@/domain/consts/timeouts.const'
import { QueueMessage } from '@/domain/entities/queue-message.entity'
import { QueueMessageStatus } from '@/domain/enums/queue/queue-message-status.enum'
import type { Logger } from '@/domain/providers/logger/logger'
import type { Queue } from '@/domain/providers/queue/queue'
import { inject } from '@/infra/dependency-injection/registry'

export class InMemoryQueueAdapter implements Queue {
  private readonly isTestEnvironment = process.env.NODE_ENV === 'test'
  private readonly queues: Map<string, QueueMessage<unknown>[]>
  private readonly maxTries: number
  private readonly retryDelay: number

  @inject('logger')
  private readonly logger!: Logger

  constructor(maxTries = 1, retryDelay = ONE_SECOND) {
    this.queues = new Map()
    this.maxTries = maxTries
    this.retryDelay = retryDelay
  }

  async connect(): Promise<void> {}

  async register(queueName: string): Promise<void> {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, [])
    }
  }

  async publish<T>(queueName: string, data: T, options?: { delay?: number }): Promise<void> {
    if (this.queues.has(queueName)) {
      const queue = this.queues.get(queueName)
      if (queue) {
        const message = QueueMessage.create<T>({
          data,
          delay: options?.delay
        })
        queue.push(message)
      }
    } else {
      this.logger.error(`Queue ${queueName} does not exist`)
    }
  }

  async consume<T>(queueName: string, callback: (data: T) => Promise<void>): Promise<void> {
    if (!this.queues.has(queueName.split('.')[0])) {
      this.logger.error(`Queue ${queueName} does not exist`)
      return
    }

    const queue = this.queues.get(queueName.split('.')[0])
    const processQueue = async (): Promise<void> => {
      if (queue) {
        const pendingMessages = queue.filter((msg) => {
          const isPending = msg.status === 'pending' || (msg.status === 'error' && msg.attempts < this.maxTries)
          if (!isPending) return false
          if (msg.delay && msg.createdAt) {
            const timeSinceCreation = Date.now() - msg.createdAt.getTime()
            if (timeSinceCreation < msg.delay) return false
          }

          return true
        })
        for (const message of pendingMessages) {
          if (message.status === 'error' && message.lastAttempt) {
            const timeSinceLastAttempt = Date.now() - message.lastAttempt.getTime()
            if (timeSinceLastAttempt < this.retryDelay) {
              continue
            }
          }
          message.process()
          try {
            await callback(message.data as T)
            message.complete()
          } catch (error) {
            message.status = QueueMessageStatus.ERROR
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            message.error(errorMessage)
            if (message.attempts >= this.maxTries) {
              this.logger.error(`Message ${message.id} failed after ${this.maxTries} attempts: ${message.errorMessage}`)
            }
          }
        }
      }
    }

    if (!this.isTestEnvironment) {
      setInterval(() => {
        void processQueue()
      }, this.retryDelay)
    }
  }
}
