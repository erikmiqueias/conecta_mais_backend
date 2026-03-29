import { OutputGetUserByIdDTO } from "../../dtos/user.dto.js";
import { UserNotFoundError } from "../../errors/errors.js";
import { IGetUserByIdRepository } from "../../interfaces/user/repositories/index.js";
import { IGetUserByIdUseCase } from "../../interfaces/user/usecases/index.js";

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
