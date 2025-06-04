export interface CheckStatusUsecaseOutput {
  status: string
}

export class CheckStatusUsecase {
  async execute(): Promise<CheckStatusUsecaseOutput> {
    return { status: 'OK' }
  }
}
