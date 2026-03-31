import { IGetUserByIdRepository } from "@modules/user/repositories/interfaces/get-user-by-id.interface.js";
import { UserNotFoundError } from "@shared/errors/errors.js";

import {
  InputGetOrganizerEventsDTO,
  OutputGetOrganizerEventsDTO,
} from "../dtos/event.dto.js";
import { IGetOrganizerEventsRepository } from "../repositories/interfaces/get-organizer-events.interface.js";
import { IGetOrganizerEventsUseCase } from "./interfaces/get-organizer-events.interface.js";

export class GetOrganizerEventsUseCase implements IGetOrganizerEventsUseCase {
  constructor(
    private getOrganizerEventsRepository: IGetOrganizerEventsRepository,
    private getUserByIdRepository: IGetUserByIdRepository,
  ) {}

  async execute(
    organizerId: InputGetOrganizerEventsDTO,
  ): Promise<OutputGetOrganizerEventsDTO> {
    const organizer = await this.getUserByIdRepository.execute(organizerId);

    if (!organizer) {
      throw new UserNotFoundError();
    }

    const events = await this.getOrganizerEventsRepository.execute(organizerId);
    return events;
  }
}
