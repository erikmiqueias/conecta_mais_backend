import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { InputUpdateUserDTO, OutputUpdateUserDTO } from "../dtos/user.dto.js";
import {
  IGetUserByEmailRepository,
  IGetUserByIdRepository,
  IUpdateUserRepository,
} from "../repositories/index.js";

export class UpdateUserUseCase {
  constructor(
    private readonly updateUserRepository: IUpdateUserRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
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
