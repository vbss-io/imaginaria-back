export enum QueueMessageStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error'
}

export const queueMessageStatus = Object.values(QueueMessageStatus)
