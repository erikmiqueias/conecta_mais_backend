import { prisma } from "@infra/database/lib/db.js";
import { IRemoveParticipantFromEventRepository } from "@modules/event/repositories/remove-participant.from-event.interface.js";

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
