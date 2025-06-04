import { ImagineGateways } from '@/domain/enums/images/imagine-gateways.enum'
import type {
    ImagineImageGateway,
    ImagineImageGatewayInput,
    ImagineImageGatewayOutput
} from '@/domain/gateways/imagine-image.gateway'
import type { HttpClient } from '@/domain/providers/http/http-client'
import type { FileConverter } from '@/domain/services/file-converter.service'
import { ImageDimensions } from '@/domain/vos/image-dimensions.vo'
import { inject } from '@/infra/dependency-injection/registry'

interface OpenAIDalle3Response {
  data: Array<{
    url: string
  }>
  error?: {
    message: string
  }
}

export class OpenAIDalle3HttpGateway implements ImagineImageGateway {
  protected url = process.env.OPENAI_URL
  protected baseConfig = {
    model: 'dall-e-3'
  }

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  @inject('fileConverterService')
  private readonly fileConverterService!: FileConverter

  async imagine({ prompt, aspectRatio }: ImagineImageGatewayInput): Promise<ImagineImageGatewayOutput> {
    try {
      const { width, height } = ImageDimensions.create(ImagineGateways.OPEN_AI_DALLE3, aspectRatio).getValues()
      const request = await this.httpClient.post<OpenAIDalle3Response>({
        url: `${this.url}/v1/images/generations`,
        body: {
          ...this.baseConfig,
          prompt,
          n: 1,
          size: `${width}x${height}`
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_KEY}`
        }
      })
      if (request.error) throw new Error(request.error.message)
      const image = request.data[0]
      const imageBase64 = await this.fileConverterService.urlToBase64(image.url)
      return {
        image: imageBase64,
        seed: 0
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        image: '',
        seed: 0,
        errorMessage
      }
    }
  }
}
