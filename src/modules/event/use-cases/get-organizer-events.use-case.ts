import { IGetUserByIdRepository } from "@modules/user/repositories/interfaces/index.js";
import { UserNotFoundError } from "@shared/errors/errors.js";

import {
  InputGetOrganizerEventsDTO,
  OutputGetOrganizerEventsDTO,
} from "../dtos/event.dto.js";
import { IGetOrganizerEventsRepository } from "../repositories/interfaces/index.js";
import { IGetOrganizerEventsUseCase } from "./interfaces/index.js";

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
