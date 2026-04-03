import { prisma } from "@shared/lib/db.js";

import { OutputGetAvailableEventsDTO } from "../dtos/event.dto.js";
import { IGetAvailableEventsRepository } from "./interfaces/index.js";

export class GetAvailableEventsRepository implements IGetAvailableEventsRepository {
  async execute(userId?: string): Promise<OutputGetAvailableEventsDTO> {
    const events = await prisma.event.findMany({
      where: {
        deletedAt: null,
        organizerId: userId ? { not: userId } : undefined,
        eventType: "PUBLIC",
      },
      take: 10,
      include: {
        organizer: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        startDateTime: "asc",
      },
    });

    const formattedEvents = events.map((event) => ({
      ...event,
      latitude: event.latitude.toNumber(),
      longitude: event.longitude.toNumber(),
    }));
    return formattedEvents;
  }
}
