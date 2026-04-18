import { GetEventByIdRepository } from "@infra/database/prisma/repositories/event/get-event-by-id.repo.js";
import { GetTicketBatchByIdRepository } from "@infra/database/prisma/repositories/ticket/get-ticket-batch-by-id.repo.js";
import { GetUserTicketsRepository } from "@infra/database/prisma/repositories/ticket/get-user-tickets.repo.js";
import { ProcessCheckoutRepository } from "@infra/database/prisma/repositories/ticket/process-checkout.repo.js";
import { UpdateTicketBatchRepository } from "@infra/database/prisma/repositories/ticket/update-ticket-batch.repo.js";
import { GetUserByIdRepository } from "@infra/database/prisma/repositories/user/get-user-by-id.repo.js";

import { CheckoutTicketUseCase } from "../use-cases/checkout-ticket-use-case.js";
import { GetUserTicketsUseCase } from "../use-cases/get-user-tickets.use-case.js";
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

export const makeCheckoutTicketUseCase = () => {
  const processChekoutRepository = new ProcessCheckoutRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const getTicketBatchByIdRepository = new GetTicketBatchByIdRepository();
  const checkoutTicketUseCase = new CheckoutTicketUseCase(
    getUserByIdRepository,
    getTicketBatchByIdRepository,
    processChekoutRepository,
  );
  return checkoutTicketUseCase;
};

export const makeGetUserTicketsUseCase = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getUserTicketsRepository = new GetUserTicketsRepository();
  const getUserTicketsUseCase = new GetUserTicketsUseCase(
    getUserTicketsRepository,
    getUserByIdRepository,
  );
  return getUserTicketsUseCase;
};
