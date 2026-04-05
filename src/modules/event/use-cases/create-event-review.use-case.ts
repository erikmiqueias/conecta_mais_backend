import {
  EvaluationNotDisposibleError,
  EventNotFoundError,
  UserAlreadyReviewedError,
  UserNotSubscribedError,
} from "@shared/errors/errors.js";
import { checkEvaluationWindow } from "@shared/utils/evaluation-window.js";

import { InputCreateEventReviewDTO } from "../dtos/event.dto.js";
import { ICreateEventReviewRepository } from "../repositories/interfaces/create-event-review.interface.js";
import { IGetEventByIdRepository } from "../repositories/interfaces/get-event-by-id.interface.js";
import { IGetUserReviewRepository } from "../repositories/interfaces/get-user-review.interface.js";
import { IGetUserSubscribeRepository } from "../repositories/interfaces/get-user-subscribe.interface.js";
import { ICreateEventReviewUseCase } from "./interfaces/create-event-review.interface.js";

export class CreateEventReviewUseCase implements ICreateEventReviewUseCase {
  constructor(
    private readonly createEventReviewRepository: ICreateEventReviewRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserReviewRepository: IGetUserReviewRepository,
    private readonly getUserSubscribeRepository: IGetUserSubscribeRepository,
  ) {}
  async execute(
    eventId: string,
    userId: string,
    data: InputCreateEventReviewDTO,
  ): Promise<boolean> {
    const [eventExists, isReview, isSubscribe] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserReviewRepository.execute(eventId),
      this.getUserSubscribeRepository.execute(userId, eventId),
    ]);

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    if (!isSubscribe) {
      throw new UserNotSubscribedError();
    }

    if (isReview) {
      throw new UserAlreadyReviewedError();
    }

    const evaluationWindow = checkEvaluationWindow(eventExists.endDateTime);

    if (!evaluationWindow.isOpen) {
      throw new EvaluationNotDisposibleError(
        (evaluationWindow.message ?? evaluationWindow.errorCode)!,
      );
    }

    if (eventExists.organizerId === userId) {
      throw new UserAlreadyReviewedError();
    }

    return !!(await this.createEventReviewRepository.execute(
      eventId,
      userId,
      data,
    ));
  }
}
