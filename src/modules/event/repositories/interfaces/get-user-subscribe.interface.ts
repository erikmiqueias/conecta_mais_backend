export interface IGetUserSubscribeRepository {
  execute(userId: string, eventId: string): Promise<boolean>;
}
