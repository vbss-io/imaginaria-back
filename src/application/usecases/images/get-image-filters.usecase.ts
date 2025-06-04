import type { GetImageFiltersQuery, GetImageFiltersQueryOutput } from '@/domain/queries/get-image-filters.query'
import { inject } from '@/infra/dependency-injection/registry'

export type GetImageFiltersUsecaseOutput = GetImageFiltersQueryOutput

export class GetImageFiltersUsecase {
  @inject('getImageFiltersQuery')
  private readonly getImageFiltersQuery!: GetImageFiltersQuery

  async execute(): Promise<GetImageFiltersUsecaseOutput> {
    return await this.getImageFiltersQuery.execute()
  }
}
