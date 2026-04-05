import { EventStatus } from "@generated/prisma/enums.js";
import { prisma } from "@shared/lib/db.js";

import { IGetEventByIdRepository } from "./interfaces/index.js";

export class GetEventByIdRepository implements IGetEventByIdRepository {
  async execute(eventId: string): Promise<{
    organizerId: string;
    id: string;
    endDateTime: Date;
    status: EventStatus;
  } | null> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        organizerId: true,
        endDateTime: true,
        status: true,
      },
    });
    return event;
  }
}
