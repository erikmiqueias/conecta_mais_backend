import { TicketStatus } from "@generated/prisma/enums.js";
import { prisma } from "@infra/database/lib/db.js";
import { OutputProcessCheckoutDTO } from "@modules/ticket/dtos/ticket.dto.js";
import { IProcessCheckoutRepository } from "@modules/ticket/repositories/process-checkout.interface.js";
import { CapacityExceededError } from "@shared/errors/errors.js";

export class ProcessCheckoutRepository implements IProcessCheckoutRepository {
  async execute(
    userId: string,
    batchId: string,
    ticketStatus: TicketStatus,
  ): Promise<OutputProcessCheckoutDTO> {
    const result = await prisma.$transaction(async (tx) => {
      const updatedBatch = await tx.ticketBatch.update({
        where: { id: batchId },
        data: {
          soldCount: { increment: 1 },
        },
        include: {
          event: true,
        },
      });

      if (updatedBatch.soldCount > updatedBatch.totalCapacity) {
        throw new CapacityExceededError();
      }

      const newTicket = await tx.ticket.create({
        data: {
          userId,
          ticketBatchId: batchId,
          status: ticketStatus,
        },
        include: {
          ticketBatch: {
            include: {
              event: true,
            },
          },
        },
      });

      return newTicket;
    });

    return result;
  }
}
