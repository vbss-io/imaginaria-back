import { BaseController } from '@/application/controllers/base.controller'
import type { DeleteImageByIdUsecase } from '@/application/usecases/images/delete-image-by-id.usecase'
import type { DislikeImageUsecase } from '@/application/usecases/images/dislike-image.usecase'
import type { GetImageByIdUsecase } from '@/application/usecases/images/get-image-by-id.usecase'
import type { GetImageFiltersUsecase } from '@/application/usecases/images/get-image-filters.usecase'
import type { GetImagesUsecase } from '@/application/usecases/images/get-images.usecase'
import type { GetRandomLandscapeImageUsecase } from '@/application/usecases/images/get-random-landscape-image.usecase'
import type { GetUserImagesUsecase } from '@/application/usecases/images/get-user-images.usecase'
import type { LikeImageUsecase } from '@/application/usecases/images/like-image.usecase'
import type { ProcessImageListener } from '@/application/usecases/images/listeners/process-image.usecase'
import type { RequestImageUsecase } from '@/application/usecases/images/request-image.usecase'
import { HttpMethod } from '@/domain/enums/http/http-methods'
import { HttpStatusCodes } from '@/domain/enums/http/http-status-codes'
import type { ImageRequestedData } from '@/domain/events/image-requested.event'
import type { InputValidate } from '@/infra/adapters/validate/zod-adapter'
import { inject } from '@/infra/dependency-injection/registry'
import type { IdType } from '@/infra/validates/id.validate'
import type { GetImagesType } from '@/infra/validates/images/get-images.validate'
import type { RequestImageType } from '@/infra/validates/images/request-image.validate'

export class ImagesController extends BaseController {
  @inject('requestImageValidate')
  private readonly requestImageValidate!: InputValidate<RequestImageType>

  @inject('requestImageUsecase')
  private readonly requestImageUsecase!: RequestImageUsecase

  @inject('imageByIdValidate')
  private readonly imageByIdValidate!: InputValidate<IdType>

  @inject('getImageByIdUsecase')
  private readonly getImageByIdUsecase!: GetImageByIdUsecase

  @inject('deleteImageByIdUsecase')
  private readonly deleteImageByIdUsecase!: DeleteImageByIdUsecase

  @inject('getImagesValidate')
  private readonly getImagesValidate!: InputValidate<GetImagesType>

  @inject('getImagesUsecase')
  private readonly getImagesUsecase!: GetImagesUsecase

  @inject('getUserImagesUsecase')
  private readonly getUserImagesUsecase!: GetUserImagesUsecase

  @inject('getRandomLandscapeImageUsecase')
  private readonly getRandomLandscapeImageUsecase!: GetRandomLandscapeImageUsecase

  @inject('getImageFiltersUsecase')
  private readonly getImageFiltersUsecase!: GetImageFiltersUsecase

  @inject('likeImageUsecase')
  private readonly likeImageUsecase!: LikeImageUsecase

  @inject('dislikeImageUsecase')
  private readonly dislikeImageUsecase!: DislikeImageUsecase

  @inject('processImageListener')
  private readonly processImageListener!: ProcessImageListener

  constructor() {
    super()

    this.httpServer.register(
      HttpMethod.POST,
      '/image',
      async (params: RequestImageType) => {
        const { id: authorId } = this.requestFacade.getUser()
        const inputParsed = this.requestImageValidate.validate(params)
        return await this.requestImageUsecase.execute({
          ...inputParsed,
          authorId
        })
      },
      HttpStatusCodes.CREATED
    )

    this.httpServer.register(
      HttpMethod.GET,
      '/image/:id',
      async (params: IdType) => {
        const inputParsed = this.imageByIdValidate.validate(params)
        return await this.getImageByIdUsecase.execute(inputParsed)
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    this.httpServer.register(
      HttpMethod.DELETE,
      '/image/:id',
      async (params: IdType) => {
        const { id: userId } = this.requestFacade.getUser()
        const inputParsed = this.imageByIdValidate.validate(params)
        await this.deleteImageByIdUsecase.execute({ ...inputParsed, userId })
      },
      HttpStatusCodes.NO_CONTENT
    )

    this.httpServer.register(
      HttpMethod.GET,
      '/images',
      async (params: GetImagesType) => {
        const page = Number(params.page ?? 1)
        const rowsPerPage = Number(params.rowsPerPage ?? 25)
        const inputParsed = this.getImagesValidate.validate({ ...params, page, rowsPerPage })
        return await this.getImagesUsecase.execute(inputParsed)
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    this.httpServer.register(
      HttpMethod.GET,
      '/images/user',
      async (params: GetImagesType) => {
        const { id: authorId } = this.requestFacade.getUser()
        const page = Number(params.page ?? 1)
        const rowsPerPage = Number(params.rowsPerPage ?? 25)
        const inputParsed = this.getImagesValidate.validate({ ...params, page, rowsPerPage })
        return await this.getUserImagesUsecase.execute({ ...inputParsed, authorId })
      },
      HttpStatusCodes.OK
    )

    this.httpServer.register(
      HttpMethod.GET,
      '/images/banner',
      async () => {
        return await this.getRandomLandscapeImageUsecase.execute()
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    this.httpServer.register(
      HttpMethod.GET,
      '/images/filters',
      async () => {
        return await this.getImageFiltersUsecase.execute()
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    this.httpServer.register(
      HttpMethod.PATCH,
      '/image/like/:id',
      async (params: IdType) => {
        const inputParsed = this.imageByIdValidate.validate(params)
        await this.likeImageUsecase.execute(inputParsed)
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    this.httpServer.register(
      HttpMethod.PATCH,
      '/image/dislike/:id',
      async (params: IdType) => {
        const inputParsed = this.imageByIdValidate.validate(params)
        await this.dislikeImageUsecase.execute(inputParsed)
      },
      HttpStatusCodes.OK,
      'isPublic'
    )

    void this.queue.consume('imageRequested.processImage', async (input: ImageRequestedData) => {
      await this.processImageListener.execute(input)
    })
  }
}
