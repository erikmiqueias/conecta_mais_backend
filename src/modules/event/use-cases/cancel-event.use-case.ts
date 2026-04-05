import {
  CannotCancelPastEventError,
  EventAlreadyCanceledError,
  EventNotAuthorizedError,
  EventNotFoundError,
} from "@shared/errors/errors.js";

import { IGetEventByIdRepository } from "../repositories/interfaces/get-event-by-id.interface.js";
import { IUpdateEventStatusRepository } from "../repositories/interfaces/update-event-status.interface.js";
import { ICancelEventUseCase } from "./interfaces/cancel-event.interface.js";

export class CancelEventUseCase implements ICancelEventUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly updateEventStatusRepository: IUpdateEventStatusRepository,
  ) {}

  async execute(organizerId: string, eventId: string): Promise<boolean> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    if (eventExists.organizerId !== organizerId) {
      throw new EventNotAuthorizedError();
    }

    if (eventExists.status === "CANCELED") {
      throw new EventAlreadyCanceledError();
    }

    const now = new Date();
    if (eventExists.endDateTime < now) {
      throw new CannotCancelPastEventError();
    }

    return await this.updateEventStatusRepository.execute(eventId, "CANCELED");
  }
}
