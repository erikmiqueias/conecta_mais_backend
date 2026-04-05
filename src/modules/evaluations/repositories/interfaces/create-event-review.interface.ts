import { InputCreateEventReviewDTO } from "../../dtos/evaluations.dtos.js";

export interface ICreateEventReviewRepository {
  execute(
    eventId: string,
    userId: string,
    data: InputCreateEventReviewDTO,
  ): Promise<boolean>;
}
