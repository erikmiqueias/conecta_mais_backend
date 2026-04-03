import { prisma } from "@shared/lib/db.js";

import { IRemoveParticipantFromEventRepository } from "./interfaces/index.js";

export class RemoveParticipantFromEventRepository implements IRemoveParticipantFromEventRepository {
  async execute(eventId: string, userId: string): Promise<boolean> {
    const deletedSubscription = await prisma.eventSubscription.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    return !!deletedSubscription;
  }
}
