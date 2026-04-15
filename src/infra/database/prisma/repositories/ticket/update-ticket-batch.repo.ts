import { prisma } from "@infra/database/lib/db.js";
import {
  InputTicketBatchDTO,
  OutputTicketBatchDTO,
} from "@modules/ticket/dtos/ticket.dto.js";
import { IUpdateTicketBatchRepository } from "@modules/ticket/repositories/update-ticket-batch.interface.js";

export class UpdateTicketBatchRepository implements IUpdateTicketBatchRepository {
  async execute(
    eventId: string,
    batchId: string,
    data: InputTicketBatchDTO,
  ): Promise<OutputTicketBatchDTO> {
    return await prisma.ticketBatch.update({
      where: {
        id: batchId,
        eventId,
      },
      data,
    });
  }
}
