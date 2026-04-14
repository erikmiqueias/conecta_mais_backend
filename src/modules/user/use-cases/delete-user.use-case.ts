import {
  EmailIsNotVerifiedError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import {
  IDeleteUserRepository,
  IGetUserByIdRepository,
} from "../repositories/index.js";

export class DeleteUserUseCase {
  constructor(
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly deleteUserRepository: IDeleteUserRepository,
  ) {}
  async execute(userId: string): Promise<boolean> {
    const userExists = await this.getUserByIdRepository.execute(userId);

    if (!userExists) {
      throw new UserNotFoundError();
    }
    if (!userExists.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }

    return await this.deleteUserRepository.execute(userId);
  }
}
