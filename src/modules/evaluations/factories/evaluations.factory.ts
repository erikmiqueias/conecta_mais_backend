import { CreateEventReviewRepository } from "@infra/database/prisma/repositories/evaluations/create-event-review.repo.js";
import { GetUserReviewRepository } from "@infra/database/prisma/repositories/evaluations/get-user-review.repo.js";
import { GetEventByIdRepository } from "@infra/database/prisma/repositories/event/get-event-by-id.repo.js";
import { GetUserSubscribeRepository } from "@infra/database/prisma/repositories/event/get-user-subscribe.repo.js";

import { CreateEventReviewUseCase } from "../use-cases/create-event-review.use-case.js";
import { GenerateEvaluateQrCodeUseCase } from "../use-cases/generate-evaluate-qrcode.use-case.js";

export const makeCreateEventReviewUseCase = () => {
  const createEventReviewRepository = new CreateEventReviewRepository();
  const getUserReviewRepository = new GetUserReviewRepository();
  const getEventByIdRepository = new GetEventByIdRepository();
  const getUserSubscribeRepository = new GetUserSubscribeRepository();
  const createEventReviewUseCase = new CreateEventReviewUseCase(
    createEventReviewRepository,
    getEventByIdRepository,
    getUserReviewRepository,
    getUserSubscribeRepository,
  );
  return createEventReviewUseCase;
};

export const makeGenerateEvaluateQrCodeUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const generateEvaluateQrCodeUseCase = new GenerateEvaluateQrCodeUseCase(
    getEventByIdRepository,
  );
  return generateEvaluateQrCodeUseCase;
};
