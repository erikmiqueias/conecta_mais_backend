import { prisma } from "@shared/lib/db.js";

import { IGetUserReviewRepository } from "./interfaces/index.js";

export class GetUserReviewRepository implements IGetUserReviewRepository {
  async execute(eventId: string, userId: string): Promise<boolean> {
    return !!(await prisma.eventReview.findFirst({
      where: {
        eventId,
        userId,
      },
    }));
  }
}
