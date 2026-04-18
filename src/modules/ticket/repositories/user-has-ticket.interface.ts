export interface UserHasTicketRepository {
  execute(batchId: string, userId: string): Promise<boolean>;
}
