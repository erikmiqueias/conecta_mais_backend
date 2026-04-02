import { prisma } from "@shared/lib/db.js";

import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "../dtos/event.dto.js";
import { IUpdateEventRepository } from "./interfaces/update-event.interface.js";

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
