import { OutputGetUserSubscriptionsDTO } from "../dtos/event.dto.js";
import { IGetUserSubscriptionsRepository } from "../repositories/index.js";

export class GetUserSubscriptionsUseCase implements GetUserSubscriptionsUseCase {
  constructor(
    private readonly getUserSubscriptionsRepository: IGetUserSubscriptionsRepository,
  ) {}

  async execute(userId: string): Promise<OutputGetUserSubscriptionsDTO> {
    return await this.getUserSubscriptionsRepository.execute(userId);
  }
}
