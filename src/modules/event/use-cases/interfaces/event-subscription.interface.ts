import { OutputEventSubscriptionDTO } from "@modules/event/dtos/event.dto.js";

export interface IEventSubscriptionUseCase {
  execute(
    eventId: string,
    userId: string,
    accessCode?: string,
  ): Promise<OutputEventSubscriptionDTO>;
}
