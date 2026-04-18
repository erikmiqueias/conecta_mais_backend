import { OutputGetTicketByIdDTO } from "../dtos/ticket.dto.js";

export interface IGetTicketByIdRepository {
  execute(ticketId: string): Promise<OutputGetTicketByIdDTO | null>;
}
