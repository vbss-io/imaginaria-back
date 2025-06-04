import bcrypt from 'bcryptjs'

export interface PasswordAuthentication {
  hash: (password: string) => Promise<string>
  compare: (password: string, hashedPassword: string) => Promise<boolean>
}

export class BcryptAdapter implements PasswordAuthentication {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }
}
