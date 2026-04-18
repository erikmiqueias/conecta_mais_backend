import { prisma } from "@infra/database/lib/db.js";
import { UserHasTicketRepository } from "@modules/ticket/repositories/user-has-ticket.interface.js";

export class GetTicketByBatchIdAndUserIdRepository implements UserHasTicketRepository {
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
