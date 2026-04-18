export interface IGetTicketByUserIdRepository {
  execute(userId: string): Promise<boolean>;
}
