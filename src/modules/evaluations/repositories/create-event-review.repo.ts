import { prisma } from "@shared/lib/db.js";

import { ICreateEventReviewRepository } from "../../event/repositories/interfaces/index.js";
import { InputCreateEventReviewDTO } from "../dtos/evaluations.dtos.js";

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
