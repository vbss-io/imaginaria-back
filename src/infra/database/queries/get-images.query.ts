import type { GetImagesQuery, GetImagesQueryInput, GetImagesQueryOutput } from '@/domain/queries/get-images.query'
import { FileUrl } from '@/domain/vos/file-url.vo'
import { GetImagesQueryBuilderMongoose } from '@/infra/database/queries/builders/get-images.builder'
import { ImageModel } from '@/infra/database/schemas/image.schema'

export class GetImagesQueryMongoose implements GetImagesQuery {
  async execute(input: GetImagesQueryInput): Promise<GetImagesQueryOutput> {
    const query = GetImagesQueryBuilderMongoose.init(ImageModel)
      .search(input.searchMask)
      .status(input.status)
      .modelName(input.modelName)
      .origin(input.origin)
      .aspectRatio(input.aspectRatio)
      .authorId(input.authorId)
      .paginate(input.page, input.rowsPerPage)
    if (input.orderBy && input.orderByDirection) {
      query.orderBy(input.orderBy, input.orderByDirection)
    }
    const { total, images } = await query.execute()
    const mappedImages = images.map((image) => ({
      id: image.id.toString() as string,
      status: image.status,
      width: image.width,
      height: image.height,
      aspectRatio: image.aspectRatio,
      path: FileUrl.create(image.path).getValue(),
      prompt: image.prompt,
      negativePrompt: image.negativePrompt,
      origin: image.origin,
      modelName: image.modelName,
      likes: image.likes,
      tags: image.tags,
      seed: image.seed,
      errorMessage: image.errorMessage,
      gatewayTaskId: image.gatewayTaskId,
      createdAt: image.createdAt,
      author: {
        id: image.author.id.toString(),
        name: image.author.name,
        avatar: FileUrl.create(image.author.avatar).getValue()
      }
    }))
    return {
      total,
      images: mappedImages
    }
  }
}
