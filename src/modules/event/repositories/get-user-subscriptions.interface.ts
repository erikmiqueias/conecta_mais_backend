import { OutputGetUserSubscriptionsDTO } from "@modules/event/dtos/event.dto.js";

export interface IGetUserSubscriptionsRepository {
  execute(userId: string): Promise<OutputGetUserSubscriptionsDTO>;
}
