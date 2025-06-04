import type { GetImagesQuery, GetImagesQueryOutput } from '@/domain/queries/get-images.query'
import { inject } from '@/infra/dependency-injection/registry'
import type { GetImagesType } from '@/infra/validates/images/get-images.validate'

export type GetUserImagesUsecaseInput = GetImagesType & {
  authorId: string
}

export type GetUserImagesUsecaseOutput = GetImagesQueryOutput

export class GetUserImagesUsecase {
  @inject('getImagesQuery')
  private readonly getImagesQuery!: GetImagesQuery

  async execute(input: GetUserImagesUsecaseInput): Promise<GetUserImagesUsecaseOutput> {
    return await this.getImagesQuery.execute(input)
  }
}
