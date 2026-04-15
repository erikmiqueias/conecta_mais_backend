import { TicketStatus } from "@generated/prisma/enums.js";
import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  TicketBatchNotFoundError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { OutputProcessCheckoutDTO } from "../dtos/ticket.dto.js";
import { IGetTicketBatchByIdRepository } from "../repositories/get-ticket-batch-by-id.interface.js";
import { IProcessCheckoutRepository } from "../repositories/process-checkout.interface.js";

export class CheckoutTicketUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getticketBatchByIdRepository: IGetTicketBatchByIdRepository,
    private readonly processCheckoutRepository: IProcessCheckoutRepository,
  ) {}

  async execute(
    userId: string,
    batchId: string,
  ): Promise<OutputProcessCheckoutDTO> {
    const [user, ticketBatch] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      this.getticketBatchByIdRepository.execute(batchId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (user.emailVerified === false) throw new EmailIsNotVerifiedError();
    if (!ticketBatch) throw new TicketBatchNotFoundError();

    const ticketStatus: TicketStatus =
      ticketBatch.price > 0 ? "PENDING" : "SOLD";

    return this.processCheckoutRepository.execute(
      userId,
      batchId,
      ticketStatus,
    );
  }
}
