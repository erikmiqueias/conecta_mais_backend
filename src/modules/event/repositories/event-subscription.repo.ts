import { prisma } from "@shared/lib/db.js";

import { OutputEventSubscriptionDTO } from "../dtos/event.dto.js";
import { IEventSubscriptionRepository } from "./interfaces/index.js";

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
