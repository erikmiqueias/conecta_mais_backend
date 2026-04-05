import { InputCreateEventReviewDTO } from "@modules/event/dtos/event.dto.js";

export interface ICreateEventReviewUseCase {
  execute(
    eventId: string,
    userId: string,
    data: InputCreateEventReviewDTO,
  ): Promise<boolean>;
}
