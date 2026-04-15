import { TicketStatus } from "@generated/prisma/enums.js";

import { OutputProcessCheckoutDTO } from "../dtos/ticket.dto.js";

export interface IProcessCheckoutRepository {
  execute(
    userId: string,
    batchId: string,
    ticketStatus: TicketStatus,
  ): Promise<OutputProcessCheckoutDTO>;
}
