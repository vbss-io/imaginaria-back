import { ImagesController } from '@/application/controllers/images/images.controller'
import { DeleteImageByIdUsecase } from '@/application/usecases/images/delete-image-by-id.usecase'
import { DislikeImageUsecase } from '@/application/usecases/images/dislike-image.usecase'
import { GetImageByIdUsecase } from '@/application/usecases/images/get-image-by-id.usecase'
import { GetImageFiltersUsecase } from '@/application/usecases/images/get-image-filters.usecase'
import { GetImagesUsecase } from '@/application/usecases/images/get-images.usecase'
import { GetRandomLandscapeImageUsecase } from '@/application/usecases/images/get-random-landscape-image.usecase'
import { GetUserImagesUsecase } from '@/application/usecases/images/get-user-images.usecase'
import { LikeImageUsecase } from '@/application/usecases/images/like-image.usecase'
import { ProcessImageListener } from '@/application/usecases/images/listeners/process-image.usecase'
import { RequestImageUsecase } from '@/application/usecases/images/request-image.usecase'
import type { Queue } from '@/domain/providers/queue/queue'
import { ZodAdapter } from '@/infra/adapters/validate/zod-adapter'
import { GetImageFiltersQueryMongoose } from '@/infra/database/queries/get-image-filters.query'
import { GetImagesQueryMongoose } from '@/infra/database/queries/get-images.query'
import { GetRandomLandscapeImageQueryMongoose } from '@/infra/database/queries/get-random-landscape-image.query'
import { ImageRepositoryMongo } from '@/infra/database/repositories/image.repository'
import { inject, Registry } from '@/infra/dependency-injection/registry'
import { IdSchema } from '@/infra/validates/id.validate'
import { GetImagesSchema } from '@/infra/validates/images/get-images.validate'
import { RequestImageSchema } from '@/infra/validates/images/request-image.validate'

export class ImagesModule {
  @inject('queue')
  private readonly queue!: Queue

  constructor() {
    void this.queue.register('imageRequested', 'imageRequested.processImage')
    const registry = Registry.getInstance()
    registry.provide('requestImageValidate', new ZodAdapter(RequestImageSchema))
    registry.provide('imageByIdValidate', new ZodAdapter(IdSchema))
    registry.provide('getImagesValidate', new ZodAdapter(GetImagesSchema))
    registry.provide('imageRepository', new ImageRepositoryMongo())
    registry.provide('getImagesQuery', new GetImagesQueryMongoose())
    registry.provide('getImageFiltersQuery', new GetImageFiltersQueryMongoose())
    registry.provide('getRandomLandscapeImageQuery', new GetRandomLandscapeImageQueryMongoose())
    registry.provide('processImageListener', new ProcessImageListener())
    registry.provide('requestImageUsecase', new RequestImageUsecase())
    registry.provide('getImageByIdUsecase', new GetImageByIdUsecase())
    registry.provide('deleteImageByIdUsecase', new DeleteImageByIdUsecase())
    registry.provide('getImagesUsecase', new GetImagesUsecase())
    registry.provide('getUserImagesUsecase', new GetUserImagesUsecase())
    registry.provide('getImageFiltersUsecase', new GetImageFiltersUsecase())
    registry.provide('getRandomLandscapeImageUsecase', new GetRandomLandscapeImageUsecase())
    registry.provide('likeImageUsecase', new LikeImageUsecase())
    registry.provide('dislikeImageUsecase', new DislikeImageUsecase())
    new ImagesController()
  }
}
