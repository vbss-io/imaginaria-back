import { BlobServiceClient } from '@azure/storage-blob'

import type { FileStorage } from '@/domain/providers/storage/file-storage'

export class AzureImageStorageAdapter implements FileStorage {
  protected connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string
  protected containerName = process.env.AZURE_STORAGE_CONTAINER_NAME as string

  async uploadBase64(base64Image: string, type: string): Promise<string> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    const containerClient = blobServiceClient.getContainerClient(this.containerName)
    const filename = crypto.randomUUID()
    const finalFilename = `${filename}.${type}`
    const blockBlobClient = containerClient.getBlockBlobClient(finalFilename)
    const buffer = Buffer.from(base64Image, 'base64')
    await blockBlobClient.upload(buffer, Buffer.byteLength(buffer))
    return `/${this.containerName}/${finalFilename}`
  }

  async delete(filepath: string): Promise<void> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString)
    const containerClient = blobServiceClient.getContainerClient(this.containerName)
    const filename = filepath.replace(`/${this.containerName}/`, '')
    const blockBlobClient = containerClient.getBlockBlobClient(filename)
    await blockBlobClient.deleteIfExists({
      deleteSnapshots: 'include'
    })
  }
}
