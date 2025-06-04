export class User {
  id: string | undefined
  hash: string
  avatar?: string

  private constructor(
    id: string | undefined,
    readonly username: string,
    hash: string,
    readonly role: string,
    avatar?: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {
    this.id = id
    this.hash = hash
    this.avatar = avatar
  }

  static create(input: UserCreate): User {
    return new User(undefined, input.username, input.hash, input.role, input.avatar)
  }

  static restore(input: UserRestore): User {
    return new User(input.id, input.username, input.hash, input.role, input.avatar, input.createdAt, input.updatedAt)
  }

  updateHash(hash: string): void {
    this.hash = hash
  }

  updateAvatar(avatar: string): void {
    this.avatar = avatar
  }
}

export interface UserCreate {
  username: string
  hash: string
  role: string
  avatar?: string
}

export type UserRestore = UserCreate & {
  id: string
  createdAt: Date
  updatedAt: Date
}
