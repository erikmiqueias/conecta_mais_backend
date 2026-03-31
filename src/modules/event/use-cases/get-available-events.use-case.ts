import { IGetUserByIdRepository } from "@modules/user/repositories/interfaces/get-user-by-id.interface.js";
import { UserNotFoundError } from "@shared/errors/errors.js";

import { OutputGetAvailableEventsDTO } from "../dtos/event.dto.js";
import { IGetAvailableEventsRepository } from "../repositories/interfaces/get-available-events.interface.js";
import { IGetAvailableEventsUseCase } from "./interfaces/get-available-events.interface.js";

export class GetAvailableEventsUseCase implements IGetAvailableEventsUseCase {
  constructor(
    private readonly getAvailableEventsRepository: IGetAvailableEventsRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}

  async execute(userId?: string): Promise<OutputGetAvailableEventsDTO> {
    if (!userId) {
      return this.getAvailableEventsRepository.execute();
    }

    const userExists = await this.getUserByIdRepository.execute(userId);
    if (!userExists) {
      throw new UserNotFoundError();
    }
    const events = await this.getAvailableEventsRepository.execute(userId);
    return events;
  }
}
