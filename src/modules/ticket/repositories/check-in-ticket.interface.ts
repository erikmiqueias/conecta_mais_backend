export interface ICheckInTicketRepository {
  execute(ticketId: string): Promise<boolean>;
}
