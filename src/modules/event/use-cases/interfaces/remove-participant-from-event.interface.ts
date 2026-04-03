export interface IRemoveParticipantFromEventUseCase {
  execute(eventId: string, userId: string): Promise<boolean>;
}
