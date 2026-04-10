import {
  CannotReopenPastEventError,
  EventAlreadyReopenedError,
  EventNotAuthorizedError,
  EventNotCanceledError,
  EventNotFoundError,
} from "@shared/errors/errors.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";

import {
  IGetEventByIdRepository,
  IUpdateEventStatusRepository,
} from "../repositories/index.js";

export class ReopenEventUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly updateEventStatusRepository: IUpdateEventStatusRepository,
    private readonly mailProvider: IMailQueueProvider,
  ) {}
  async execute(eventId: string, organizerId: string): Promise<boolean> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    if (eventExists.organizerId !== organizerId) {
      throw new EventNotAuthorizedError();
    }

    if (eventExists.status === "SCHEDULED") {
      throw new EventAlreadyReopenedError();
    }

    if (eventExists.status !== "CANCELED") {
      throw new EventNotCanceledError();
    }

    const now = new Date();
    if (eventExists.endDateTime < now) {
      throw new CannotReopenPastEventError();
    }

    const isReopened = await this.updateEventStatusRepository.execute(
      eventId,
      "SCHEDULED",
    );

    if (isReopened) {
      await this.mailProvider.addJob({
        to: eventExists.organizer.email,
        subject: "O evento foi reaberto",
        body: `O evento ${eventExists.name} foi reaberto`,
      });
    }
    return isReopened;
  }
}
