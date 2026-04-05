import { InputCreateEventReviewDTO } from "@modules/event/dtos/event.dto.js";

export interface ICreateEventReviewRepository {
  execute(
    eventId: string,
    userId: string,
    data: InputCreateEventReviewDTO,
  ): Promise<boolean>;
}
