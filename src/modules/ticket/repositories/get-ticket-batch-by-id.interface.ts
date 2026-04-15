import { OutputGetTicketBatchByIdDTO } from "../dtos/ticket.dto.js";

export interface IGetTicketBatchByIdRepository {
  execute(batchId: string): Promise<OutputGetTicketBatchByIdDTO | null>;
}
