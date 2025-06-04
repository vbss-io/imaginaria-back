import type {
    ImagineImageGateway,
    ImagineImageGatewayInput,
    ImagineImageGatewayOutput
} from '@/domain/gateways/imagine-image.gateway'
import { type HttpClient } from '@/domain/providers/http/http-client'
import type { FileConverter } from '@/domain/services/file-converter.service'
import { inject } from '@/infra/dependency-injection/registry'

interface RequestGenResponse {
  data: {
    task_id: string
    error?: {
      message: string
    }
  }
}

interface CheckGenStatusResponse {
  data: {
    status: string
    output: {
      image_url: string
    }
  }
}

export class GoApiMidjourneyHttpGateway implements ImagineImageGateway {
  protected DELAY = 60000
  protected MAX_TRIES = 10
  protected url = process.env.MIDJOURNEY_URL

  @inject('httpClient')
  private readonly httpClient!: HttpClient

  @inject('fileConverterService')
  private readonly fileConverterService!: FileConverter

  async imagine(input: ImagineImageGatewayInput): Promise<ImagineImageGatewayOutput> {
    const baseOutput = { image: '', seed: 0, taskId: '' }
    try {
      const request = await this.requestGenImage(input.prompt, input.aspectRatio)
      baseOutput.taskId = request.data.task_id
      if (request.data.error?.message) {
        const errorMessage = `Midjourney Imagine Error: ${request.data.error.message}`
        return {
          ...baseOutput,
          errorMessage
        }
      }
      let statusRequest
      let checkGenTries = 0
      while (true) {
        await this.delay(this.DELAY)
        statusRequest = await this.checkTaskStatus(baseOutput.taskId)
        if (statusRequest.data.status === 'completed') break
        checkGenTries++
        if (checkGenTries > this.MAX_TRIES) {
          const errorMessage = 'Midjourney Imagine Error: Time out / Max tries'
          return {
            ...baseOutput,
            errorMessage
          }
        }
      }
      const upscaleRequest = await this.requestUpscaleImage(baseOutput.taskId, '1')
      if (upscaleRequest.data.error?.message) {
        const errorMessage = `Midjourney Upscale Error: ${upscaleRequest.data.error.message}`
        return {
          ...baseOutput,
          errorMessage
        }
      }
      const upscaleTaskId = upscaleRequest.data.task_id
      let upscaleStatusRequest
      let checkUpscaleTries = 0
      while (true) {
        await this.delay(this.DELAY)
        upscaleStatusRequest = await this.checkTaskStatus(upscaleTaskId)
        if (statusRequest.data.status === 'completed') break
        checkUpscaleTries++
        if (checkUpscaleTries > this.MAX_TRIES) {
          const errorMessage = 'Midjourney Imagine Error: Time out / Max tries'
          return {
            ...baseOutput,
            errorMessage
          }
        }
      }
      const image = await this.fileConverterService.urlToBase64(upscaleStatusRequest.data.output.image_url)
      return {
        ...baseOutput,
        image
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return {
        ...baseOutput,
        errorMessage
      }
    }
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async requestGenImage(prompt: string, aspect_ratio: string): Promise<RequestGenResponse> {
    return await this.httpClient.post({
      url: `${this.url}/api/v1/task`,
      body: {
        model: 'midjourney',
        task_type: 'imagine',
        input: {
          prompt,
          aspect_ratio,
          process_mode: 'relax'
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
  }

  private async requestUpscaleImage(taskId: string, imageIndex: string): Promise<RequestGenResponse> {
    return await this.httpClient.post({
      url: `${this.url}/api/v1/task`,
      body: {
        model: 'midjourney',
        task_type: 'upscale',
        input: {
          origin_task_id: taskId,
          index: imageIndex
        }
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
  }

  private async checkTaskStatus(taskId: string): Promise<CheckGenStatusResponse> {
    return await this.httpClient.get({
      url: `${this.url}/api/v1/task/${taskId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.MIDJOURNEY_KEY
      }
    })
  }
}
