import { prisma } from "@infra/database/lib/db.js";
import { IGetTicketByUserIdRepository } from "@modules/ticket/repositories/get-ticket-by-user-id.interface.js";

export class GetTicketByUserIdRepository implements IGetTicketByUserIdRepository {
  async execute(userId: string): Promise<boolean> {
    const ticket = await prisma.ticket.findFirst({
      where: {
        userId,
      },
    });
    return !!ticket;
  }
}
