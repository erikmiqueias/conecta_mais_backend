import { prisma } from "@infra/database/lib/db.js";
import { OutputEventSubscriptionDTO } from "@modules/event/dtos/event.dto.js";
import { IEventSubscriptionRepository } from "@modules/event/repositories/event-subscription.interface.js";

export class EventSubscriptionRepository implements IEventSubscriptionRepository {
  async execute(
    eventId: string,
    userId: string,
  ): Promise<OutputEventSubscriptionDTO> {
    const subscription = await prisma.eventSubscription.create({
      data: {
        eventId,
        userId,
      },
      select: {
        id: true,
        subscriptionDateTime: true,
      },
    });
    return subscription;
  }
}
