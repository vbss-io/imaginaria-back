import { type Model, type PipelineStage, Types } from 'mongoose'

import type { ImageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import type { ImageStatus } from '@/domain/enums/images/image-status.enum'
import type { ImageDocument } from '@/infra/database/schemas/image.schema'

type SortDirection = 'ASC' | 'DESC'
type SortField = 'createdAt' | 'likes'

interface AuthorInfo {
  id: Types.ObjectId
  name: string
  avatar: string
}

interface ImageWithAuthor extends Omit<ImageDocument, 'authorId'> {
  author: AuthorInfo
}

export class GetImagesQueryBuilderMongoose {
  private basePipeline: PipelineStage[] = []
  private paginationStages: PipelineStage[] = []
  private readonly model: Model<ImageDocument>

  private constructor(model: Model<ImageDocument>) {
    this.model = model
    this.basePipeline.push({
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author'
      }
    })
    this.basePipeline.push({
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
    })
    this.basePipeline.push({
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        status: 1,
        width: 1,
        height: 1,
        aspectRatio: 1,
        path: 1,
        prompt: 1,
        negativePrompt: 1,
        origin: 1,
        modelName: 1,
        likes: 1,
        tags: 1,
        seed: 1,
        errorMessage: 1,
        gatewayTaskId: 1,
        authorId: 1,
        createdAt: 1,
        author: {
          id: '$author._id',
          name: '$author.username',
          avatar: '$author.avatar'
        }
      }
    })
    this.orderBy('createdAt', 'DESC')
  }

  static init(model: Model<ImageDocument>): GetImagesQueryBuilderMongoose {
    return new GetImagesQueryBuilderMongoose(model)
  }

  search(searchMask?: string): this {
    if (!searchMask) return this
    const searchRegex = new RegExp(searchMask, 'i')
    this.basePipeline.push({
      $match: {
        $or: [{ prompt: searchRegex }, { negativePrompt: searchRegex }]
      }
    })
    return this
  }

  status(status?: ImageStatus): this {
    if (!status) return this
    this.basePipeline.push({
      $match: { status }
    })
    return this
  }

  modelName(modelName?: string): this {
    if (!modelName) return this
    this.basePipeline.push({
      $match: { modelName }
    })
    return this
  }

  origin(origin?: string): this {
    if (!origin) return this
    this.basePipeline.push({
      $match: { origin }
    })
    return this
  }

  aspectRatio(aspectRatio?: ImageAspectRatio): this {
    if (!aspectRatio) return this
    this.basePipeline.push({
      $match: { aspectRatio }
    })
    return this
  }

  authorId(authorId?: string): this {
    if (!authorId) return this
    this.basePipeline.push({
      $match: { authorId: new Types.ObjectId(authorId) }
    })
    return this
  }

  paginate(page: number, rowsPerPage: number): this {
    const skip = (page - 1) * rowsPerPage
    this.paginationStages = [{ $skip: skip }, { $limit: rowsPerPage }]
    return this
  }

  orderBy(field: SortField, direction: SortDirection): this {
    const sortDirection = direction === 'ASC' ? 1 : -1
    this.basePipeline.push({
      $sort: {
        [field]: sortDirection
      }
    })
    return this
  }

  private async getTotalCount(): Promise<number> {
    const countPipeline = [...this.basePipeline, { $count: 'total' }]
    const [result] = (await this.model.aggregate(countPipeline).exec()) as Array<{ total: number }>
    return result?.total || 0
  }

  async execute(): Promise<{
    images: ImageWithAuthor[]
    total: number
  }> {
    const [images, total] = await Promise.all([
      this.model.aggregate([...this.basePipeline, ...this.paginationStages]).exec(),
      this.getTotalCount()
    ])
    return {
      images: images as ImageWithAuthor[],
      total
    }
  }
}
