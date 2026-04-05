import { prisma } from "@shared/lib/db.js";

import { IGetUserReviewRepository } from "./interfaces/get-user-review.interface.js";

export class GetUserReviewRepository implements IGetUserReviewRepository {
  async execute(eventId: string): Promise<boolean> {
    return !!(await prisma.eventReview.findFirst({
      where: {
        eventId,
      },
    }));
  }
}
