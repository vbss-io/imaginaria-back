import type { HttpClient } from '@/domain/providers/http/http-client'
import type { CustomFile, FileConverter } from '@/domain/services/file-converter.service'
import { inject } from '@/infra/dependency-injection/registry'

export class FileConverterService implements FileConverter {
  @inject('httpClient')
  private readonly httpClient!: HttpClient

  fileToBase64(file: CustomFile): string {
    return file.buffer.toString('base64')
  }

  async urlToBase64(url: string): Promise<string> {
    const arrayBuffer = await this.httpClient.get({
      url: url,
      responseType: 'arraybuffer'
    })
    const base64 = Buffer.from(arrayBuffer as string, 'binary').toString('base64')
    return base64
  }
}
