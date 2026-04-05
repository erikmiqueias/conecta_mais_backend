export interface IReopenEventUseCase {
  execute(eventId: string, organizerId: string): Promise<boolean>;
}
