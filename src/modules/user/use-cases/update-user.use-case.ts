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
    const [userExists, userWithSameEmail] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      data.email
        ? this.getUserByEmailRepository.execute(data.email)
        : Promise.resolve(null),
    ]);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    if (userWithSameEmail && userWithSameEmail.id !== userId) {
      throw new EmailAlreadyExistsError();
    }

    return await this.updateUserRepository.execute(userId, data);
  }
}
