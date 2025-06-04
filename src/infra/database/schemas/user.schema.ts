import { type Document, model, Schema } from 'mongoose'

export interface UserDocument extends Document {
  _id: string
  username: string
  hash: string
  role: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String, required: false, default: null },
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

export const UserModel = model<UserDocument>('User', userSchema)
