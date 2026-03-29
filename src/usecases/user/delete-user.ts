import { UserNotFoundError } from "@errors/errors.js";
import {
  IDeleteUserRepository,
  IGetUserByIdRepository,
} from "@interfaces/user/repositories/index.js";
import { IDeleteUserUseCase } from "@interfaces/user/usecases/index.js";

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

    const deletedUser = await this.deleteUserRepository.execute(userId);

    return deletedUser;
  }
}
