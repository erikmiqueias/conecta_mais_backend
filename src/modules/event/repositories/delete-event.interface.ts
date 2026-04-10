export interface IDeleteEventRepository {
  execute(eventId: string): Promise<boolean>;
}
