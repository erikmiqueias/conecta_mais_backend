export interface IRemoveParticipantFromEventRepository {
  execute(eventId: string, userId: string): Promise<boolean>;
}
