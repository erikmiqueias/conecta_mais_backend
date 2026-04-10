import { IGetUserByIdRepository } from "@modules/user/repositories/index.js";
import { UserNotFoundError } from "@shared/errors/errors.js";

import { OutputGetAvailableEventsDTO } from "../dtos/event.dto.js";
import { IGetAvailableEventsRepository } from "../repositories/index.js";

export class GetAvailableEventsUseCase {
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

    return await this.getAvailableEventsRepository.execute(userId);
  }
}
