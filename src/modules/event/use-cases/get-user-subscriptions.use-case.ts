import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { OutputGetUserSubscriptionsDTO } from "../dtos/event.dto.js";
import { IGetUserSubscriptionsRepository } from "../repositories/index.js";

export class GetUserSubscriptionsUseCase implements GetUserSubscriptionsUseCase {
  constructor(
    private readonly getUserSubscriptionsRepository: IGetUserSubscriptionsRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}

  async execute(userId: string): Promise<OutputGetUserSubscriptionsDTO> {
    const user = await this.getUserByIdRepository.execute(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    if (!user.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }
    return await this.getUserSubscriptionsRepository.execute(userId);
  }
}
