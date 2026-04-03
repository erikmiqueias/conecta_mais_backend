import { prisma } from "@shared/lib/db.js";

import { OutputGetUserSubscriptionsDTO } from "../dtos/event.dto.js";
import { IGetUserSubscriptionsRepository } from "./interfaces/get-user-subscriptions.interface.js";

export class GetUserSubscriptionsRepository implements IGetUserSubscriptionsRepository {
  async execute(userId: string): Promise<OutputGetUserSubscriptionsDTO> {
    const userSubscriptions = await prisma.eventSubscription.findMany({
      where: {
        userId,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            description: true,
            eventAddress: true,
            eventType: true,
            startDateTime: true,
            endDateTime: true,
            organizer: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });
    return userSubscriptions;
  }
}
