export class FileUrl {
  private readonly value?: string

  private constructor(value?: string) {
    this.value = value
  }

  static create(path?: string): FileUrl {
    const baseUrl = process.env.FILES_STORAGE || ''
    const url = path ? `${baseUrl}${path}` : undefined
    return new FileUrl(url)
  }

  getValue(): string | undefined {
    return this.value
  }
}
