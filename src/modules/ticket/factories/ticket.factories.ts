import { GetEventByIdRepository } from "@infra/database/prisma/repositories/event/get-event-by-id.repo.js";
import { GetTicketBatchByIdRepository } from "@infra/database/prisma/repositories/ticket/get-ticket-batch-by-id.repo.js";
import { UpdateTicketBatchRepository } from "@infra/database/prisma/repositories/ticket/update-ticket-batch.repo.js";
import { GetUserByIdRepository } from "@infra/database/prisma/repositories/user/get-user-by-id.repo.js";

import { UpdateTicketBatchUseCase } from "../use-cases/update-ticket-batch.use-case.js";

export const makeUpdateTicketBatchUseCase = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getEventByIdRepository = new GetEventByIdRepository();
  const getTicketBatchByIdRepository = new GetTicketBatchByIdRepository();
  const updateTicketBatchRepository = new UpdateTicketBatchRepository();
  const updateTicketBatchUseCase = new UpdateTicketBatchUseCase(
    getUserByIdRepository,
    getEventByIdRepository,
    getTicketBatchByIdRepository,
    updateTicketBatchRepository,
  );
  return updateTicketBatchUseCase;
};
