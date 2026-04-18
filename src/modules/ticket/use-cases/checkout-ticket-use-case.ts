import { TicketStatus } from "@generated/prisma/enums.js";
import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  TicketBatchNotFoundError,
  UserAlreadyHasTicketError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { OutputProcessCheckoutDTO } from "../dtos/ticket.dto.js";
import { IGetTicketBatchByIdRepository } from "../repositories/get-ticket-batch-by-id.interface.js";
import { IGetTicketByUserIdRepository } from "../repositories/get-ticket-by-user-id.interface.js";
import { IProcessCheckoutRepository } from "../repositories/process-checkout.interface.js";

export class CheckoutTicketUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getTicketBatchByIdRepository: IGetTicketBatchByIdRepository,
    private readonly processCheckoutRepository: IProcessCheckoutRepository,
    private readonly getTicketByUserIdRepository: IGetTicketByUserIdRepository,
  ) {}

  async execute(
    userId: string,
    batchId: string,
  ): Promise<OutputProcessCheckoutDTO> {
    const [user, ticketBatch, hasTicket] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      this.getTicketBatchByIdRepository.execute(batchId),
      this.getTicketByUserIdRepository.execute(userId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (user.emailVerified === false) throw new EmailIsNotVerifiedError();
    if (!ticketBatch) throw new TicketBatchNotFoundError();
    if (hasTicket) throw new UserAlreadyHasTicketError();

    const ticketStatus: TicketStatus =
      ticketBatch.price > 0 ? "PENDING" : "SOLD";

    return this.processCheckoutRepository.execute(
      userId,
      batchId,
      ticketStatus,
    );
  }
}
