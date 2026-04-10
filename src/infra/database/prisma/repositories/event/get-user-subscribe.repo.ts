import { prisma } from "@infra/database/lib/db.js";
import { IGetUserSubscribeRepository } from "@modules/event/repositories/get-user-subscribe.interface.js";

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
