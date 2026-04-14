import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EventNotAuthorizedError,
  EventNotFoundError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { OutputGetEventParticipantsDTO } from "../dtos/event.dto.js";
import {
  IGetEventByIdRepository,
  IGetEventParticipantsRepository,
} from "../repositories/index.js";

export class GetEventParticipantsUseCase {
  constructor(
    private readonly getEventParticipantsRepository: IGetEventParticipantsRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}
  async execute(
    eventId: string,
    organizerId: string,
  ): Promise<OutputGetEventParticipantsDTO> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);
    const userExists = await this.getUserByIdRepository.execute(organizerId);

    if (!userExists) throw new UserNotFoundError();
    if (!userExists.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }

    if (!eventExists) throw new EventNotFoundError();
    const isOwner = eventExists.organizerId === organizerId;

    if (!isOwner) throw new EventNotAuthorizedError();

    return await this.getEventParticipantsRepository.execute(
      eventId,
      organizerId,
    );
  }
}
