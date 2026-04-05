import { EventStatus } from "@generated/prisma/enums.js";
import { prisma } from "@shared/lib/db.js";

import { IUpdateEventStatusRepository } from "./interfaces/update-event-status.interface.js";

export class UpdateEventStatusRepository implements IUpdateEventStatusRepository {
  async execute(eventId: string, status: EventStatus): Promise<boolean> {
    return !!(await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        status,
      },
    }));
  }
}
