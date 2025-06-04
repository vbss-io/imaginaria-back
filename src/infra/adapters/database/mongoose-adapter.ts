import mongoose from 'mongoose'

import { DatabaseConnectionCloseError, DatabaseConnectionError } from '@/domain/errors/catalog.errors'
import type { Logger } from '@/domain/providers/logger/logger'
import { inject } from '@/infra/dependency-injection/registry'

export interface DatabaseConnection {
  connect: () => Promise<void>
  close: () => Promise<void>
}

export class MongooseAdapter implements DatabaseConnection {
  connection: string

  @inject('logger')
  private readonly logger!: Logger

  constructor(readonly connectionString?: string) {
    this.connection = (connectionString ?? process.env.MONGO_URI) as string
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.connection)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(errorMessage)
      throw new DatabaseConnectionError()
    }
  }

  async close(): Promise<void> {
    try {
      await mongoose.connection.close()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.logger.error(errorMessage)
      throw new DatabaseConnectionCloseError()
    }
  }
}
