import { prisma } from "@infra/database/lib/db.js";
import {
  InputGetOrganizerEventsDTO,
  OutputGetOrganizerEventsDTO,
} from "@modules/event/dtos/event.dto.js";
import { IGetOrganizerEventsRepository } from "@modules/event/repositories/get-organizer-events.interface.js";

export class GetOrganizerEventsRepository implements IGetOrganizerEventsRepository {
  async execute(
    organizerId: InputGetOrganizerEventsDTO,
  ): Promise<OutputGetOrganizerEventsDTO> {
    return await prisma.event.findMany({
      where: {
        organizerId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
