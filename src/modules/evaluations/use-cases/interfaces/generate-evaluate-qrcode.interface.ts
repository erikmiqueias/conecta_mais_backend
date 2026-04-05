export interface IGenerateEvaluateQrCodeUseCase {
  execute(eventId: string, organizerId: string): Promise<string>;
}
