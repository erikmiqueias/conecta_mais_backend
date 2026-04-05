import { prisma } from "@shared/lib/db.js";

import { InputCreateEventReviewDTO } from "../dtos/event.dto.js";
import { ICreateEventReviewRepository } from "./interfaces/create-event-review.interface.js";

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
