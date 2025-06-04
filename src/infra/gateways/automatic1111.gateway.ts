// import { type ImagineImageInput, type ImagineImageOutput } from '@/image/domain/gateways/dtos/ImagineImageGateway.dto'
// import { type ImagineImageGateway } from '@/image/domain/gateways/imagine-image.gateway'
// import { type HttpClient } from '@/domain/providers/http/http-client'
// import { inject } from '@/infra/dependency-injection/registry'

// export class Automatic1111GatewayHttp implements ImagineImageGateway {
//   protected url = process.env.STABLE_DIFFUSION_URL
//   protected baseConfig = {
//     save_images: true
//   }

//   @inject('httpClient')
//   private readonly httpClient!: HttpClient

//   mapAspectRatio = {
//     '1:1': { width: 1024, height: 1024 },
//     '16:9': { width: 1920, height: 1080 },
//     '9:16': { width: 1080, height: 1920 },
//     '4:3': { width: 1024, height: 768 },
//     '3:4': { width: 768, height: 1024 },
//     '21:9': { width: 2560, height: 1080 },
//     '9:21': { width: 1080, height: 2520 }
//   }

//   async imagine(input: ImagineImageInput): Promise<ImagineImageOutput> {
//     const aspectRatio = input.aspectRadio as keyof typeof this.mapAspectRatio
//     const baseOutput = {
//       images: [],
//       prompt: input.prompt,
//       negativePrompt: input.negative_prompt ?? 'none',
//       seeds: [],
//       width: this.mapAspectRatio[aspectRatio].width,
//       height: this.mapAspectRatio[aspectRatio].height,
//       sampler: input.sampler_index,
//       scheduler: input.scheduler,
//       steps: input.steps,
//       model: 'none',
//       origin: 'Automatic1111',
//       taskId: 'none'
//     }
//     try {
//       const response = await this.httpClient.post<any>({
//         url: `${this.url}/sdapi/v1/txt2img`,
//         body: {
//           ...this.baseConfig,
//           width: this.mapAspectRatio[aspectRatio].width,
//           height: this.mapAspectRatio[aspectRatio].height,
//           ...input
//         },
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       const info = JSON.parse(response.info as string)
//       if (input.batch_size > 1) {
//         response.images.shift()
//       }
//       return {
//         ...baseOutput,
//         images: response.images,
//         seeds: info.all_seeds,
//         sampler: info.sampler_name,
//         scheduler: response.parameters.scheduler,
//         model: info.sd_model_name
//       }
//     } catch (error: any) {
//       return {
//         ...baseOutput,
//         errorMessage: error.message
//       }
//     }
//   }
// }
