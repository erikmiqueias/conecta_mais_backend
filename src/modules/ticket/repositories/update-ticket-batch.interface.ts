import {
  InputTicketBatchDTO,
  OutputTicketBatchDTO,
} from "../dtos/ticket.dto.js";

export interface IUpdateTicketBatchRepository {
  execute(
    eventId: string,
    batchId: string,
    data: InputTicketBatchDTO,
  ): Promise<OutputTicketBatchDTO>;
}
