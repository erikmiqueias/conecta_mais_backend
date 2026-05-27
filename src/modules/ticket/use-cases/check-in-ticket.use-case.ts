import { IGetEventByIdRepository } from "@modules/event/repositories/get-event-by-id.interface.js";
import {
  EventNotAuthorizedError,
  EventNotFoundError,
  InvalidTicketStatusError,
  TicketAlreadyCheckedInError,
  TicketNotFoundError,
} from "@shared/errors/errors.js";

import { ICheckInTicketRepository } from "../repositories/check-in-ticket.interface.js";
import { IGetTicketByIdRepository } from "../repositories/get-ticket-by-id.interface.js";

export class CheckInTicketUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly checkInTicketRepository: ICheckInTicketRepository,
    private readonly getTicketByIdRepository: IGetTicketByIdRepository,
  ) {}
  async execute(organizerId: string, ticketId: string) {
    const ticket = await this.getTicketByIdRepository.execute(ticketId);

    if (!ticket) throw new TicketNotFoundError("Ticket not found");

    const event = ticket.ticketBatch.eventId;
    const isAuthorized = await this.getEventByIdRepository.execute(event);

    if (!isAuthorized) throw new EventNotFoundError();
    if (isAuthorized?.organizerId !== organizerId)
      throw new EventNotAuthorizedError();
    if (ticket.status === "CHECKED_IN") throw new TicketAlreadyCheckedInError();

    if (ticket.status !== "SOLD") throw new InvalidTicketStatusError();

    return await this.checkInTicketRepository.execute(ticketId);
  }
}
