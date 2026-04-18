import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  TicketNotAuthorizedError,
  TicketNotFoundError,
  TicketQRCodeError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { IGetTicketByIdRepository } from "../repositories/get-ticket-by-id.interface.js";
import { TicketEncoderService } from "../services/ticket-encoder.serivice.js";

export class GenerateTicketQRCodeUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getTicketByIdRepository: IGetTicketByIdRepository,
    private readonly ticketEncoderService: TicketEncoderService,
  ) {}
  async execute(userId: string, ticketId: string) {
    const [user, ticket] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      this.getTicketByIdRepository.execute(ticketId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (!ticket) throw new TicketNotFoundError("Ticket not found");

    if (ticket.userId !== userId)
      throw new TicketNotAuthorizedError("User does not own this ticket");

    if (ticket.status !== "SOLD")
      throw new TicketQRCodeError(
        "Qr code can only be generated for sold tickets",
      );

    return await this.ticketEncoderService.execute(
      ticket.id,
      ticket.ticketCode,
      ticket.ticketBatch.eventId,
    );
  }
}
