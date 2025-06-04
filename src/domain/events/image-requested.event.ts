import type { ImagineGateways } from '@/domain/enums/images/imagine-gateways.enum'
import type { DomainEvent } from '@/domain/events/domain-event'

export interface ImageRequestedData {
  imageId: string
  gateway: ImagineGateways
}

export class ImageRequested implements DomainEvent<ImageRequestedData> {
  eventName = 'imageRequested'

  constructor(readonly data: ImageRequestedData) {}
}
