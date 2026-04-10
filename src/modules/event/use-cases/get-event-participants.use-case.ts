import {
  EventNotAuthorizedError,
  EventNotFoundError,
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
  ) {}
  async execute(
    eventId: string,
    organizerId: string,
  ): Promise<OutputGetEventParticipantsDTO> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) throw new EventNotFoundError();
    const isOwner = eventExists.organizerId === organizerId;

    if (!isOwner) throw new EventNotAuthorizedError();

    return await this.getEventParticipantsRepository.execute(
      eventId,
      organizerId,
    );
  }
}
