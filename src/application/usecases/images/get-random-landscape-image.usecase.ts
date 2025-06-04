import type {
    GetRandomLandscapeImageQuery,
    GetRandomLandscapeImageQueryOutput
} from '@/domain/queries/get-random-landscape-image.query'
import { inject } from '@/infra/dependency-injection/registry'

export type GetRandomLandscapeImageOutput = GetRandomLandscapeImageQueryOutput

export class GetRandomLandscapeImageUsecase {
  @inject('getRandomLandscapeImageQuery')
  private readonly getRandomLandscapeImageQuery!: GetRandomLandscapeImageQuery

  async execute(): Promise<GetRandomLandscapeImageOutput> {
    return await this.getRandomLandscapeImageQuery.execute()
  }
}
