import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EventNotAuthorizedError,
  EventNotFoundError,
  EventNotNeededAccessCodeError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { IGetEventByIdRepository } from "../repositories/index.js";

export class ShareEventUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}
  async execute(eventId: string, organizerId: string): Promise<string> {
    const [eventExists, userExists] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserByIdRepository.execute(organizerId),
    ]);

    if (!userExists) throw new UserNotFoundError();
    if (!userExists.emailVerified) throw new EmailIsNotVerifiedError();
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
