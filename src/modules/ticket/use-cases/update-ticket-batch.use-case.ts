import { IGetEventByIdRepository } from "@modules/event/repositories/get-event-by-id.interface.js";
import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  CapacityExceededError,
  EmailIsNotVerifiedError,
  EventNotAuthorizedError,
  EventNotFoundError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import {
  InputTicketBatchDTO,
  OutputTicketBatchDTO,
} from "../dtos/ticket.dto.js";
import { IGetTicketBatchByIdRepository } from "../repositories/get-ticket-batch-by-id.interface.js";
import { IUpdateTicketBatchRepository } from "../repositories/update-ticket-batch.interface.js";

export class UpdateTicketBatchUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getTicketBatchByIdRepository: IGetTicketBatchByIdRepository,
    private readonly updateTicketBatchRepository: IUpdateTicketBatchRepository,
  ) {}
  async execute(
    organizerId: string,
    eventId: string,
    batchId: string,
    data: InputTicketBatchDTO,
  ): Promise<OutputTicketBatchDTO> {
    const [organizer, event, ticketBatch] = await Promise.all([
      this.getUserByIdRepository.execute(organizerId),
      this.getEventByIdRepository.execute(eventId),
      this.getTicketBatchByIdRepository.execute(batchId),
    ]);

    if (!organizer) throw new UserNotFoundError();
    if (organizer.emailVerified === false) throw new EmailIsNotVerifiedError();
    if (!event) throw new EventNotFoundError();
    if (!ticketBatch) throw new Error("Ticket batch not found");
    if (event.organizerId !== organizerId) throw new EventNotAuthorizedError();

    if (ticketBatch.eventId !== eventId) throw new EventNotAuthorizedError();

    if (
      data.totalCapacity !== undefined &&
      data.totalCapacity < ticketBatch.soldCount
    )
      throw new CapacityExceededError();

    return await this.updateTicketBatchRepository.execute(
      eventId,
      batchId,
      data,
    );
  }
}
