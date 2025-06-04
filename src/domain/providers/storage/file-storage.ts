export interface FileStorage {
  uploadBase64: (base64: string, type: string) => Promise<string>
  delete: (filepath: string) => Promise<void>
}
