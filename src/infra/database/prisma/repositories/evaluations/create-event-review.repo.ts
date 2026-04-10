import { prisma } from "@infra/database/lib/db.js";
import { InputCreateEventReviewDTO } from "@modules/evaluations/dtos/evaluations.dtos.js";
import { ICreateEventReviewRepository } from "@modules/evaluations/repositories/create-event-review.interface.js";

export class CreateEventReviewRepository implements ICreateEventReviewRepository {
  async execute(
    eventId: string,
    userId: string,
    data: InputCreateEventReviewDTO,
  ): Promise<boolean> {
    return !!(await prisma.eventReview.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        userId,
        eventId,
      },
    }));
  }
}
