import { prisma } from "@infra/database/lib/db.js";
import { OutputGetTicketBatchByIdDTO } from "@modules/ticket/dtos/ticket.dto.js";
import { IGetTicketBatchByIdRepository } from "@modules/ticket/repositories/get-ticket-batch-by-id.interface.js";

export class GetTicketBatchByIdRepository implements IGetTicketBatchByIdRepository {
  async execute(batchId: string): Promise<OutputGetTicketBatchByIdDTO | null> {
    return await prisma.ticketBatch.findUnique({
      where: { id: batchId },
    });
  }
}
