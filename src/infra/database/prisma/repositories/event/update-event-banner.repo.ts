import { prisma } from "@infra/database/lib/db.js";
import { IUpdateEventBannerRepository } from "@modules/event/repositories/update-event-banner.interface.js";

export class UpdateEventBannerRepository implements IUpdateEventBannerRepository {
  async execute(eventId: string, bannerUrl: string): Promise<void> {
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        bannerUrl,
      },
    });
  }
}
