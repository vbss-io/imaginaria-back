export enum ImageStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  ERROR = 'error',
  PROCESSED = 'processed'
}

export const imageStatus = Object.values(ImageStatus)
