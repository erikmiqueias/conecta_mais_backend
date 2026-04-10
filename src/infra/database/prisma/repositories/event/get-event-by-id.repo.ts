import { prisma } from "@infra/database/lib/db.js";
import { OutputGetEventByIdDTO } from "@modules/event/dtos/event.dto.js";
import { IGetEventByIdRepository } from "@modules/event/repositories/get-event-by-id.interface.js";

export class GetEventByIdRepository implements IGetEventByIdRepository {
  async execute(eventId: string): Promise<OutputGetEventByIdDTO | null> {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        organizerId: true,
        endDateTime: true,
        status: true,
        eventType: true,
        accessCode: true,
        name: true,
        description: true,
        eventAddress: true,
        startDateTime: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        organizer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return event;
  }
}
