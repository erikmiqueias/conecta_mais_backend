import { prisma } from "@infra/database/lib/db.js";
import { OutputGetUserTicketsDTO } from "@modules/ticket/dtos/ticket.dto.js";
import { IGetUserTicketsRepository } from "@modules/ticket/repositories/get-user-ticket.interface.js";

export class GetUserTicketsRepository implements IGetUserTicketsRepository {
  async execute(userId: string): Promise<OutputGetUserTicketsDTO> {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId,
        status: { not: "CANCELED" },
      },
      include: {
        ticketBatch: {
          include: {
            event: true,
          },
        },
      },
    });

    return tickets;
  }
}
