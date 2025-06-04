export enum ImagineGateways {
  GO_API_MIDJOURNEY = 'goApiMidjourney',
  OPEN_AI_DALLE3 = 'openAiDalle3'
}

export const GatewayOriginName = {
  [ImagineGateways.GO_API_MIDJOURNEY]: 'GoApi',
  [ImagineGateways.OPEN_AI_DALLE3]: 'Open Ai'
}

export const GatewayModelName = {
  [ImagineGateways.GO_API_MIDJOURNEY]: 'Midjourney',
  [ImagineGateways.OPEN_AI_DALLE3]: 'Dalle-3'
}
