import { prisma } from "@infra/database/lib/db.js";
import { OutputGetTicketByIdDTO } from "@modules/ticket/dtos/ticket.dto.js";
import { IGetTicketByIdRepository } from "@modules/ticket/repositories/get-ticket-by-id.interface.js";

export class GetTicketByIdRepository implements IGetTicketByIdRepository {
  async execute(ticketId: string): Promise<OutputGetTicketByIdDTO | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        ticketBatch: {
          include: {
            event: true,
          },
        },
      },
    });
    return ticket;
  }
}
