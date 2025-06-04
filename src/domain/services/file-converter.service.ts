export type CustomFile = File & {
  buffer: Buffer
  mimetype: string
}

export interface FileConverter {
  fileToBase64(file: CustomFile): string
  urlToBase64(url: string): Promise<string>
}
