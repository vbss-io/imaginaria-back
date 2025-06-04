import { Image } from '@/domain/entities/image.entity'
import type { ImageRepository } from '@/domain/repositories/image.repository'
import { BaseRepositoryMongoose } from '@/infra/database/repositories/@base.repository'
import { type ImageDocument, ImageModel } from '@/infra/database/schemas/image.schema'

export class ImageRepositoryMongo
  extends BaseRepositoryMongoose<ImageDocument, Image>
  implements ImageRepository<ImageDocument>
{
  constructor(model = ImageModel) {
    super(model)
  }

  // async getImagesByIds(ids: string[]): Promise<Image[] | []> {
  //   const findOptions = { _id: { $in: ids } }
  //   const imageDocs = await ImageModel.find(findOptions)
  //   return imageDocs.map((imageDoc) => {
  //     return this.toDomain(imageDoc)
  //   })
  // }

  // async getRandomLandscapeImage(): Promise<Image | undefined> {
  //   const [imageDoc] = await ImageModel.aggregate([
  //     { $match: { $expr: { $gt: ['$width', '$height'] } } },
  //     { $sample: { size: 1 } }
  //   ])
  //   if (!imageDoc) return
  //   return this.toDomain(imageDoc as ImageDocument)
  // }

  toDomain(entity: ImageDocument): Image {
    return Image.restore({
      id: entity._id.toString(),
      status: entity.status,
      width: entity.width,
      height: entity.height,
      aspectRatio: entity.aspectRatio,
      seed: entity.seed,
      path: entity.path,
      prompt: entity.prompt,
      negativePrompt: entity.negativePrompt,
      origin: entity.origin,
      modelName: entity.modelName,
      likes: entity.likes,
      tags: entity.tags,
      authorId: entity.authorId.toString(),
      errorMessage: entity.errorMessage,
      gatewayTaskId: entity.gatewayTaskId,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt)
    })
  }
}
