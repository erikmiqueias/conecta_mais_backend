import { UserNotFoundError } from "@shared/errors/errors.js";

import { OutputGetUserByIdDTO } from "../dtos/user.dto.js";
import { IGetUserByIdRepository } from "../repositories/interfaces/get-user-by-id.interface.js";
import { IGetUserByIdUseCase } from "./interfaces/get-user-by-id.interface.js";

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private readonly getUserByIdRepository: IGetUserByIdRepository) {}
  async execute(userId: string): Promise<OutputGetUserByIdDTO | null> {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
