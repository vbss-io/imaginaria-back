import 'dotenv/config'

import { AuthModule } from '@/application/modules/auth.module'
import { ImagesModule } from '@/application/modules/images.module'
import { StatusModule } from '@/application/modules/status.module'
import { UsersModule } from '@/application/modules/users.module'
import { InMemoryCacheAdapter } from '@/infra/adapters/cache/in-memory-cache-adapter'
import { MongooseAdapter } from '@/infra/adapters/database/mongoose-adapter'
import { AxiosAdapter } from '@/infra/adapters/http/axios-adapter'
import { ExpressAdapter } from '@/infra/adapters/http/express-adapter'
import { WinstonLoggerAdapter } from '@/infra/adapters/logger/winston-logger-adapter'
import { InMemoryQueueAdapter } from '@/infra/adapters/queue/in-memory-queue-adapter'
import { AzureImageStorageAdapter } from '@/infra/adapters/storage/azure-storage-adapter'
import { Registry } from '@/infra/dependency-injection/registry'
import { ExpressAuthHandler } from '@/infra/handlers/express-auth-handler'
import { ExpressErrorHandler } from '@/infra/handlers/express-error-handler'
import { ExpressHttpLoggerHandler } from '@/infra/handlers/express-http-logger-handler'
import { FileConverterService } from '@/infra/services/file-converter.service'

const PORT = Number(process.env.PORT ?? 3000)

function main(): void {
  const registry = Registry.getInstance()
  const cache = InMemoryCacheAdapter.getInstance()
  registry.provide('cache', cache)
  registry.provide('queue', new InMemoryQueueAdapter())
  registry.provide('logger', new WinstonLoggerAdapter())
  registry.provide('httpClient', new AxiosAdapter())
  registry.provide('fileConverterService', new FileConverterService())
  registry.provide('fileStorage', new AzureImageStorageAdapter())
  registry.provide('errorHandler', new ExpressErrorHandler())
  registry.provide('authHandler', new ExpressAuthHandler())
  registry.provide('httpLoggerHandler', new ExpressHttpLoggerHandler())
  const databaseConnection = new MongooseAdapter()
  registry.provide('databaseConnection', databaseConnection)
  void databaseConnection.connect()
  const httpServer = new ExpressAdapter()
  registry.provide('httpServer', httpServer)
  new StatusModule()
  new UsersModule()
  new AuthModule()
  new ImagesModule()
  httpServer.start(PORT)
}
main()
