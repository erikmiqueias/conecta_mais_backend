import { prisma } from "@shared/lib/db.js";

import { OutputGetEventParticipantsDTO } from "../dtos/event.dto.js";
import { IGetEventParticipantsRepository } from "./interfaces/index.js";

export class GetEventParticipantsRepository implements IGetEventParticipantsRepository {
  async execute(
    eventId: string,
    organizerId: string,
  ): Promise<OutputGetEventParticipantsDTO> {
    const eventParticipants = await prisma.eventSubscription.findMany({
      where: {
        eventId,
        userId: {
          not: organizerId,
        },
      },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return eventParticipants;
  }
}
