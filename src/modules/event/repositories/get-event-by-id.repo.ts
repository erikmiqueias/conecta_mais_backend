import { EventStatus, EventType } from "@generated/prisma/enums.js";
import { prisma } from "@shared/lib/db.js";

import { IGetEventByIdRepository } from "./interfaces/index.js";

export class GetEventByIdRepository implements IGetEventByIdRepository {
  async execute(eventId: string): Promise<{
    organizerId: string;
    id: string;
    endDateTime: Date;
    status: EventStatus;
    eventType: EventType;
    accessCode: string | null;
  } | null> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        organizerId: true,
        endDateTime: true,
        status: true,
        eventType: true,
        accessCode: true,
      },
    });
    return event;
  }
}
