export interface GetImageFiltersQueryOutput {
  aspectRatio: string[]
  origin: string[]
  modelName: string[]
}

export interface GetImageFiltersQuery {
  execute: () => Promise<GetImageFiltersQueryOutput>
}
