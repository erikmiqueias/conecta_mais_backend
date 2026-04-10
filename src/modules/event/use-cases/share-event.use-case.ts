import {
  EventNotAuthorizedError,
  EventNotFoundError,
  EventNotNeededAccessCodeError,
} from "@shared/errors/errors.js";

import { IGetEventByIdRepository } from "../repositories/interfaces/get-event-by-id.interface.js";
import { IShareEventUseCase } from "./interfaces/share-event.interface.js";

export class ShareEventUseCase implements IShareEventUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
  ) {}
  async execute(eventId: string, organizerId: string): Promise<string> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) throw new EventNotFoundError();
    const isOwner = eventExists.organizerId === organizerId;
    if (!isOwner) throw new EventNotAuthorizedError();
    if (eventExists.eventType === "PUBLIC")
      throw new EventNotNeededAccessCodeError();

    const frontendBaseURL = process.env.FRONTEND_URL!;
    const shareableLink = `${frontendBaseURL}/events/${eventId}/subscription?accessCode=${eventExists.accessCode}`;

    return shareableLink;
  }
}
