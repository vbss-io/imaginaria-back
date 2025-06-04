import type { GetImageFiltersQuery, GetImageFiltersQueryOutput } from '@/domain/queries/get-image-filters.query'
import { ImageModel } from '@/infra/database/schemas/image.schema'

export class GetImageFiltersQueryMongoose implements GetImageFiltersQuery {
  async execute(): Promise<GetImageFiltersQueryOutput> {
    const aspectRatio = await ImageModel.find({}, { _id: 0, aspectRatio: 1 }).distinct('aspectRatio')
    const origin = await ImageModel.find({}, { _id: 0, origin: 1 }).distinct('origin')
    const modelName = await ImageModel.find({}, { _id: 0, modelName: 1 }).distinct('modelName')
    return {
      aspectRatio,
      origin,
      modelName
    }
  }
}
