import type { GetImagesQuery, GetImagesQueryOutput } from '@/domain/queries/get-images.query'
import { inject } from '@/infra/dependency-injection/registry'
import type { GetImagesType } from '@/infra/validates/images/get-images.validate'

export type GetImagesUsecaseInput = GetImagesType

export type GetImagesUsecaseOutput = GetImagesQueryOutput

export class GetImagesUsecase {
  @inject('getImagesQuery')
  private readonly getImagesQuery!: GetImagesQuery

  async execute(input: GetImagesUsecaseInput): Promise<GetImagesUsecaseOutput> {
    return await this.getImagesQuery.execute(input)
  }
}
