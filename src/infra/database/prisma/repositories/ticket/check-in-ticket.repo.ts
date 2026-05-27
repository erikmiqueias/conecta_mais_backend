import { prisma } from "@infra/database/lib/db.js";
import { ICheckInTicketRepository } from "@modules/ticket/repositories/check-in-ticket.interface.js";

export class CheckInTicketRepository implements ICheckInTicketRepository {
  async execute(ticketId: string): Promise<boolean> {
    return !!(await prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        checkInDateTime: new Date(),
      },
    }));
  }
}
