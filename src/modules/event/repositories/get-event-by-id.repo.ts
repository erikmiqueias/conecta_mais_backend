import { prisma } from "@shared/lib/db.js";

import { IGetEventByIdRepository } from "./interfaces/get-event-by-id.interface.js";

export class GetEventByIdRepository implements IGetEventByIdRepository {
  async execute(
    eventId: string,
  ): Promise<{ organizerId: string; id: string } | null> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        organizerId: true,
      },
    });
    return event;
  }
}
