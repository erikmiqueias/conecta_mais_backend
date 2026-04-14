import { IGetUserByIdRepository } from "@modules/user/repositories/index.js";
import {
  EmailIsNotVerifiedError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import {
  InputGetOrganizerEventsDTO,
  OutputGetOrganizerEventsDTO,
} from "../dtos/event.dto.js";
import { IGetOrganizerEventsRepository } from "../repositories/index.js";

export class GetOrganizerEventsUseCase {
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

    if (!organizer.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }

    return await this.getOrganizerEventsRepository.execute(organizerId);
  }
}
