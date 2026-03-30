export interface IGetEventByIdRepository {
  execute(eventId: string): Promise<{ organizerId: string; id: string } | null>;
}
