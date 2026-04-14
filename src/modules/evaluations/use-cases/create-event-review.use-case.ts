import { checkEvaluationWindow } from "@modules/evaluations/utils/evaluation-window.js";
import { IGetEventByIdRepository } from "@modules/event/repositories/get-event-by-id.interface.js";
import { IGetUserSubscribeRepository } from "@modules/event/repositories/get-user-subscribe.interface.js";
import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EvaluationNotDisposibleError,
  EventNotFoundError,
  OrganizerCannotReviewOwnEventError,
  UserAlreadyReviewedError,
  UserNotFoundError,
  UserNotSubscribedError,
} from "@shared/errors/errors.js";

import { InputCreateEventReviewDTO } from "../dtos/evaluations.dtos.js";
import { ICreateEventReviewRepository } from "../repositories/create-event-review.interface.js";
import { IGetUserReviewRepository } from "../repositories/get-user-review.interface.js";

export class CreateEventReviewUseCase {
  constructor(
    private readonly createEventReviewRepository: ICreateEventReviewRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserReviewRepository: IGetUserReviewRepository,
    private readonly getUserSubscribeRepository: IGetUserSubscribeRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}
  async execute(
    eventId: string,
    userId: string,
    data: InputCreateEventReviewDTO,
  ): Promise<boolean> {
    const [eventExists, isReview, isSubscribe, userExists] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserReviewRepository.execute(userId, eventId),
      this.getUserSubscribeRepository.execute(userId, eventId),
      this.getUserByIdRepository.execute(userId),
    ]);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    if (!userExists.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    if (eventExists.organizerId === userId) {
      throw new OrganizerCannotReviewOwnEventError();
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

    return !!(await this.createEventReviewRepository.execute(
      eventId,
      userId,
      data,
    ));
  }
}
