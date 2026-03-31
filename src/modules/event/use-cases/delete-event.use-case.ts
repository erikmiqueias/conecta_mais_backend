import { EventNotFoundError } from "@shared/errors/errors.js";

import { IDeleteEventRepository } from "../repositories/interfaces/delete-event.interface.js";
import { IGetEventByIdRepository } from "../repositories/interfaces/get-event-by-id.interface.js";
import { IDeleteEventUseCase } from "./interfaces/delete-event.interface.js";

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

    return await this.deleteEventRepository.execute(eventId);
  }
}
