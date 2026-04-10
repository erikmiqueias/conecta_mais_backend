import { prisma } from "@infra/database/lib/db.js";
import { OutputGetAvailableEventsDTO } from "@modules/event/dtos/event.dto.js";
import { IGetAvailableEventsRepository } from "@modules/event/repositories/get-available-events.interface.js";

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
