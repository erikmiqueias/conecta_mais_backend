import { prisma } from "@infra/database/lib/db.js";
import { IGetTicketByBatchIdAndUserIdRepository } from "@modules/ticket/repositories/get-ticket-by-batch-id-and-user-id.interface.js";

export class GetTicketByBatchIdAndUserIdRepository implements IGetTicketByBatchIdAndUserIdRepository {
  async execute(batchId: string, userId: string): Promise<boolean> {
    const ticket = await prisma.ticket.count({
      where: {
        ticketBatchId: batchId,
        userId,
      },
    });
    return ticket > 0;
  }
}
