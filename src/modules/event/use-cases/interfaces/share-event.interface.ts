export interface IShareEventUseCase {
  execute(eventId: string, organizerId: string): Promise<string>;
}
