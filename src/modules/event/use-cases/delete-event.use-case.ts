import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EventNotAuthorizedError,
  EventNotFoundError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import {
  IDeleteEventRepository,
  IGetEventByIdRepository,
} from "../repositories/index.js";

export class DeleteEventUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly deleteEventRepository: IDeleteEventRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}
  async execute(organizerId: string, eventId: string): Promise<boolean> {
    const [organizer, eventExists] = await Promise.all([
      this.getUserByIdRepository.execute(organizerId),
      this.getEventByIdRepository.execute(eventId),
    ]);

    if (!organizer) {
      throw new UserNotFoundError();
    }

    if (!organizer.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    const isOwner = eventExists.organizerId === organizerId;
    if (!isOwner) {
      throw new EventNotAuthorizedError();
    }

    return await this.deleteEventRepository.execute(eventId);
  }
}
