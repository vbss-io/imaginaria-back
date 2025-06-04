import type { Queue } from '@/domain/providers/queue/queue'
import type { HttpServer } from '@/infra/adapters/http/express-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { RequestFacade } from '@/infra/facades/request.facade'

export class BaseController {
  @inject('httpServer')
  protected readonly httpServer!: HttpServer

  @inject('requestFacade')
  protected readonly requestFacade!: RequestFacade

  @inject('queue')
  protected readonly queue!: Queue
}
