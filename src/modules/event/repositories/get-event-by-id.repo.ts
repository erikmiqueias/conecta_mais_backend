import { prisma } from "@shared/lib/db.js";

import { IGetEventByIdRepository } from "./interfaces/index.js";

export class GetEventByIdRepository implements IGetEventByIdRepository {
  async execute(
    eventId: string,
  ): Promise<{ organizerId: string; id: string; endDateTime: Date } | null> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        organizerId: true,
        endDateTime: true,
      },
    });
    return event;
  }
}
