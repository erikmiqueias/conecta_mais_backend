import { OutputEventSubscriptionDTO } from "@modules/event/dtos/event.dto.js";

export interface IEventSubscriptionRepository {
  execute(eventId: string, userId: string): Promise<OutputEventSubscriptionDTO>;
}
