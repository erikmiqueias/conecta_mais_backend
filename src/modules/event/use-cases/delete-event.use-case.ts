import {
  EventNotAuthorizedError,
  EventNotFoundError,
} from "@shared/errors/errors.js";

import {
  IDeleteEventRepository,
  IGetEventByIdRepository,
} from "../repositories/interfaces/index.js";
import { IDeleteEventUseCase } from "./interfaces/index.js";

export class DeleteEventUseCase implements IDeleteEventUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly deleteEventRepository: IDeleteEventRepository,
  ) {}
  async execute(eventId: string): Promise<boolean> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    const isOwner = eventExists.organizerId === eventId;
    if (!isOwner) {
      throw new EventNotAuthorizedError();
    }

    return await this.deleteEventRepository.execute(eventId);
  }
}
