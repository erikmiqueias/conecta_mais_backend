import { TicketStatus } from "@generated/prisma/enums.js";
import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  TicketBatchNotFoundError,
  UserAlreadyHasTicketError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";

import { OutputProcessCheckoutDTO } from "../dtos/ticket.dto.js";
import { IGetTicketBatchByIdRepository } from "../repositories/get-ticket-batch-by-id.interface.js";
import { IProcessCheckoutRepository } from "../repositories/process-checkout.interface.js";
import { UserHasTicketRepository } from "../repositories/user-has-ticket.interface.js";
import { TicketEncoderService } from "../services/ticket-encoder.serivice.js";

export class CheckoutTicketUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getTicketBatchByIdRepository: IGetTicketBatchByIdRepository,
    private readonly processCheckoutRepository: IProcessCheckoutRepository,
    private readonly userHasTicketRepository: UserHasTicketRepository,
    private readonly ticketEncoderService: TicketEncoderService,
    private readonly mailProvider: IMailQueueProvider,
  ) {}

  async execute(
    userId: string,
    batchId: string,
  ): Promise<OutputProcessCheckoutDTO> {
    const [user, ticketBatch, hasTicket] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      this.getTicketBatchByIdRepository.execute(batchId),
      this.userHasTicketRepository.execute(batchId, userId),
    ]);

    if (!user) throw new UserNotFoundError();
    if (user.emailVerified === false) throw new EmailIsNotVerifiedError();
    if (!ticketBatch) throw new TicketBatchNotFoundError();
    if (hasTicket) throw new UserAlreadyHasTicketError();

    const ticketStatus: TicketStatus =
      ticketBatch.price > 0 ? "PENDING" : "SOLD";

    const checkoutResult = await this.processCheckoutRepository.execute(
      userId,
      batchId,
      ticketStatus,
    );

    if (ticketStatus === "SOLD") {
      const qrcodeBase64 = await this.ticketEncoderService.execute(
        checkoutResult.id,
        checkoutResult.ticketCode,
        checkoutResult.ticketBatch.eventId,
      );

      await this.mailProvider.addJob({
        to: user.email,
        subject: `${checkoutResult.ticketBatch.event.name}`,
        attachments: [
          {
            filename: "qrcode.png",
            content: qrcodeBase64.split(",")[1],
          },
        ],
        body: `
            <h1>Parabéns! Seu ingresso para o evento ${checkoutResult.ticketBatch.event.name} foi confirmado.</h1>
            <p>Apresente o QR Code abaixo na entrada do evento para garantir sua participação.</p>
            <p>Atenção: O QR Code é único e não pode ser compartilhado.</p>
        `,
      });
    }
    return checkoutResult;
  }
}
