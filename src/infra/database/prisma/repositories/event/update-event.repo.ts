import { prisma } from "@infra/database/lib/db.js";
import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "@modules/event/dtos/event.dto.js";
import { IUpdateEventRepository } from "@modules/event/repositories/update-event.interface.js";

export class UpdateEventRepository implements IUpdateEventRepository {
  async execute(
    eventId: string,
    data: InputUpdateEventDTO,
  ): Promise<OutputUpdateEventDTO> {
    const eventUpdated = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        name: data.name,
        description: data.description,
        eventType: data.eventType,
        eventAddress: data.eventAddress,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        latitude: data.latitude,
        longitude: data.longitude,
        accessCode: data.accessCode,
      },
    });

    return {
      ...eventUpdated,
      latitude: eventUpdated.latitude.toNumber(),
      longitude: eventUpdated.longitude.toNumber(),
    };
  }
}
