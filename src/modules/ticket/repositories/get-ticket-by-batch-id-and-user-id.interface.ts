export interface IGetTicketByBatchIdAndUserIdRepository {
  execute(batchId: string, userId: string): Promise<boolean>;
}
