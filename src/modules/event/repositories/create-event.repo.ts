import { prisma } from "@shared/lib/db.js";

import {
  InputCreateEventDTO,
  OutputCreateEventDTO,
} from "../dtos/event.dto.js";
import { ICreateEventRepository } from "./interfaces/create-event.interface.js";

export class CreateEventRepository implements ICreateEventRepository {
  async execute(
    data: InputCreateEventDTO,
    userId: string,
  ): Promise<OutputCreateEventDTO> {
    const event = await prisma.event.create({
      data: {
        name: data.name,
        description: data.description,
        eventType: data.eventType,
        eventAddress: data.eventAddress,
        startDateTime: data.startDateTime,
        latitude: data.latitude!,
        longitude: data.longitude!,
        endDateTime: data.endDateTime,
        organizerId: userId,
        accessCode: data.accessCode,
      },
    });
    return {
      ...event,
      latitude: event.latitude.toNumber(),
      longitude: event.longitude.toNumber(),
      accessCode: event.accessCode ?? null,
    };
  }
}
