import { prisma } from "@shared/lib/db.js";

import { IDeleteEventRepository } from "./interfaces/index.js";

export class DeleteEventRepository implements IDeleteEventRepository {
  async execute(eventId: string): Promise<boolean> {
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });

    return !!deletedEvent;
  }
}
