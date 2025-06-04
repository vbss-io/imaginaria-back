import { ImagineGateways } from '@/domain/enums/images/imagine-gateways.enum'
import { GatewayNotImplemented } from '@/domain/errors/catalog.errors'
import type { ImagineImageGateway } from '@/domain/gateways/imagine-image.gateway'
import { GoApiMidjourneyHttpGateway } from '@/infra/gateways/go-api-midjourney.gateway'
import { OpenAIDalle3HttpGateway } from '@/infra/gateways/open-ai-dalle3.gateway'

export class ImagineImageGatewayFactory {
  static create(gateway: string): ImagineImageGateway {
    if (gateway === ImagineGateways.GO_API_MIDJOURNEY) return new GoApiMidjourneyHttpGateway()
    if (gateway === ImagineGateways.OPEN_AI_DALLE3) return new OpenAIDalle3HttpGateway()
    throw new GatewayNotImplemented()
  }
}
