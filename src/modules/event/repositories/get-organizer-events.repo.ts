import { prisma } from "@shared/lib/db.js";

import {
  InputGetOrganizerEventsDTO,
  OutputGetOrganizerEventsDTO,
} from "../dtos/event.dto.js";
import { IGetOrganizerEventsRepository } from "./interfaces/get-organizer-events.interface.js";

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
