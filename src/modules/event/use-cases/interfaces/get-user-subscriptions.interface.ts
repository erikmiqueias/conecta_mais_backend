import { OutputGetUserSubscriptionsDTO } from "@modules/event/dtos/event.dto.js";

export interface IGetUserSubscriptionsUseCase {
  execute(userId: string): Promise<OutputGetUserSubscriptionsDTO>;
}
