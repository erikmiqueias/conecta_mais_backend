import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { InputUpdateUserDTO, OutputUpdateUserDTO } from "../dtos/user.dto.js";
import {
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from "../repositories/interfaces/index.js";
import { IUpdateUserUseCase } from "./interfaces/index.js";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private readonly updateUserRepository: IUpdateUserRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getUserByEmailRepository: IGetUserByIdRepository,
  ) {}
  async execute(
    userId: string,
    data: InputUpdateUserDTO,
  ): Promise<OutputUpdateUserDTO | null> {
    const userExists = await this.getUserByIdRepository.execute(userId);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    const userWithSameEmail = await this.getUserByEmailRepository.execute(
      data.email,
    );
    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new EmailAlreadyExistsError();
    }

    const updatedUser = await this.updateUserRepository.execute(userId, data);
    return updatedUser;
  }
}
