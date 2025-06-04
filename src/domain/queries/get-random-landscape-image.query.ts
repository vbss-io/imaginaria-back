export interface GetRandomLandscapeImageQueryOutput {
  id: string
  modelName: string
  path?: string
}

export interface GetRandomLandscapeImageQuery {
  execute: () => Promise<GetRandomLandscapeImageQueryOutput>
}
