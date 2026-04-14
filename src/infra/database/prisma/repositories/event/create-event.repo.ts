import { prisma } from "@infra/database/lib/db.js";
import {
  InputCreateEventDTO,
  OutputCreateEventDTO,
} from "@modules/event/dtos/event.dto.js";
import { ICreateEventRepository } from "@modules/event/repositories/create-event.interface.js";

export class CreateEventRepository implements ICreateEventRepository {
  async execute(
    data: InputCreateEventDTO,
    organizerId: string,
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
        organizerId: organizerId,
        accessCode: data.accessCode,
        ticketBatches: {
          create: data.ticketBatches.map((batch) => {
            return {
              batchName: batch.batchName,
              price: batch.price,
              totalCapacity: batch.totalCapacity,
              soldCount: 0,
            };
          }),
        },
      },
      include: {
        ticketBatches: true,
      },
    });

    const formattedEvent = {
      ...event,
      latitude: event.latitude.toNumber(),
      longitude: event.longitude.toNumber(),
      ticketBatches: event.ticketBatches.map((batch) => ({
        ...batch,
        price: batch.price.toNumber(),
      })),
    };
    return formattedEvent;
  }
}
