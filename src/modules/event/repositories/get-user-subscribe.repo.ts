import { prisma } from "@shared/lib/db.js";

import { IGetUserSubscribeRepository } from "./interfaces/index.js";

export class GetUserSubscribeRepository implements IGetUserSubscribeRepository {
  async execute(userId: string, eventId: string): Promise<boolean> {
    const subscription = await prisma.eventSubscription.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    return !!subscription;
  }
}
