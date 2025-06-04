export interface Queue {
  connect: () => Promise<void>
  register: (exchangeName: string, queueName: string) => Promise<void>
  publish: <T>(exchangeName: string, data: T, options?: { delay?: number }) => Promise<void>
  consume: <T>(queueName: string, callback: (data: T) => Promise<void>) => Promise<void>
}
