import { UserNotFoundError } from "@shared/errors/errors.js";

import {
  IDeleteUserRepository,
  IGetUserByIdRepository,
} from "../repositories/interfaces/index.js";
import { IDeleteUserUseCase } from "./interfaces/index.js";

export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly deleteUserRepository: IDeleteUserRepository,
  ) {}
  async execute(userId: string): Promise<boolean> {
    const userExists = await this.getUserByIdRepository.execute(userId);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    return await this.deleteUserRepository.execute(userId);
  }
}
