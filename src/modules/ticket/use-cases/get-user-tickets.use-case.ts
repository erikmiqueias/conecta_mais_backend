import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  UserNotFoundError,
} from "@shared/errors/errors.js";

import { OutputGetUserTicketsDTO } from "../dtos/ticket.dto.js";
import { IGetUserTicketsRepository } from "../repositories/get-user-ticket.interface.js";

export class GetUserTicketsUseCase {
  constructor(
    private readonly getUserTicketsRepository: IGetUserTicketsRepository,
    private readonly getUserByidRepository: IGetUserByIdRepository,
  ) {}
  async execute(userId: string): Promise<OutputGetUserTicketsDTO> {
    const user = await this.getUserByidRepository.execute(userId);

    if (!user) throw new UserNotFoundError();
    if (!user.emailVerified) throw new EmailIsNotVerifiedError();

    return await this.getUserTicketsRepository.execute(userId);
  }
}
