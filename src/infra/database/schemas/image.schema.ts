import { type ImageAspectRatio, imageAspectRatio } from '@/domain/enums/images/image-aspect-ratio.enum'
import { type ImageStatus, imageStatus } from '@/domain/enums/images/image-status.enum'
import { type Document, model, Schema } from 'mongoose'

export interface ImageDocument extends Document {
  _id: string
  status: ImageStatus
  width: number
  height: number
  aspectRatio: ImageAspectRatio
  path?: string
  authorId: string
  prompt: string
  negativePrompt: string
  origin: string
  modelName: string
  likes: number
  tags: string[]
  seed?: number
  errorMessage?: string
  gatewayTaskId?: string
  createdAt: Date
  updatedAt: Date
}

const imageSchema: Schema = new Schema(
  {
    status: { type: String, required: true, enum: imageStatus, default: 'queued' },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    aspectRatio: { type: String, required: true, enum: imageAspectRatio },
    path: { type: String },
    authorId: { type: Schema.ObjectId, ref: 'User' },
    prompt: { type: String, required: true },
    negativePrompt: { type: String, required: true },
    origin: { type: String, required: true },
    modelName: { type: String, required: true },
    likes: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    seed: { type: String, default: null },
    errorMessage: { type: String, default: null },
    gatewayTaskId: { type: String, default: null },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      transform: (_, ret) => {
        ret.id = ret._id as string
        delete ret._id
        return ret
      }
    }
  }
)

export const ImageModel = model<ImageDocument>('Image', imageSchema)
