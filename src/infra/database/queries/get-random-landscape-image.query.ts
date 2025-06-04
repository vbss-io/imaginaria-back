import type {
    GetRandomLandscapeImageQuery,
    GetRandomLandscapeImageQueryOutput
} from '@/domain/queries/get-random-landscape-image.query'
import { FileUrl } from '@/domain/vos/file-url.vo'
import { type ImageDocument, ImageModel } from '@/infra/database/schemas/image.schema'

export class GetRandomLandscapeImageQueryMongoose implements GetRandomLandscapeImageQuery {
  async execute(): Promise<GetRandomLandscapeImageQueryOutput> {
    const [image] = await ImageModel.aggregate<ImageDocument>([
      {
        $match: {
          $and: [{ $expr: { $gt: ['$width', '$height'] } }, { path: { $exists: true, $nin: [null, ''] } }]
        }
      },
      { $sample: { size: 1 } },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          modelName: 1,
          path: 1
        }
      }
    ])
    return {
      id: image.id as string,
      modelName: image.modelName,
      path: FileUrl.create(image.path).getValue()
    }
  }
}
