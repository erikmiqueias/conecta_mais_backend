import { UserNotFoundError } from "../../errors/errors.js";
import { IDeleteUserRepository } from "../../interfaces/user/repositories/delete-user.js";
import { IGetUserByIdRepository } from "../../interfaces/user/repositories/get-user-by-id.js";
import { IDeleteUserUseCase } from "../../interfaces/user/usecases/delete-user.js";

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
