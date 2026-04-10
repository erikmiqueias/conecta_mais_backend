import {
  EventSubscriptionRepository,
  GetEventParticipantsRepository,
  GetUserSubscribeRepository,
  GetUserSubscriptionsRepository,
  RemoveParticipantFromEventRepository,
  UpdateEventStatusRepository,
} from "@infra/database/prisma/repositories/event/index.js";
import {
  CreateEventRepository,
  DeleteEventRepository,
  GetAvailableEventsRepository,
  GetEventByIdRepository,
  GetOrganizerEventsRepository,
  UpdateEventRepository,
} from "@infra/database/prisma/repositories/event/index.js";
import { GetUserByIdRepository } from "@infra/database/prisma/repositories/user/get-user-by-id.repo.js";
import { OpenStreetMapProvider } from "@infra/providers/geocoder/osm.provider.js";
import { BullMQMailQueueProvider } from "@infra/providers/queue/mail-queue-provider.js";
import {
  CancelEventUseCase,
  CreateEventUseCase,
  DeleteEventUseCase,
  EventSubscriptionUseCase,
  GetAvailableEventsUseCase,
  GetEventParticipantsUseCase,
  GetOrganizerEventsUseCase,
  GetUserSubscriptionsUseCase,
  RemoveParticipantFromEventUseCase,
  ReopenEventUseCase,
  ShareEventUseCase,
  UpdateEventUseCase,
} from "@modules/event/use-cases/index.js";

export const makeCreateEventUseCase = () => {
  const createEventRepository = new CreateEventRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const geoCoderProvider = new OpenStreetMapProvider();
  const mailProvider = new BullMQMailQueueProvider();
  const createEventUseCase = new CreateEventUseCase(
    createEventRepository,
    getUserByIdRepository,
    geoCoderProvider,
    mailProvider,
  );
  return createEventUseCase;
};

export const makeDeleteEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const deleteEventRepository = new DeleteEventRepository();
  const deleteEventUseCase = new DeleteEventUseCase(
    getEventByIdRepository,
    deleteEventRepository,
  );
  return deleteEventUseCase;
};

export const makeGetOrganizerEventsUseCase = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getOrganizerEventsRepository = new GetOrganizerEventsRepository();
  const getOrganizerEventsUseCase = new GetOrganizerEventsUseCase(
    getOrganizerEventsRepository,
    getUserByIdRepository,
  );
  return getOrganizerEventsUseCase;
};

export const makeGetAvailableEventsUseCase = () => {
  const getUserByIdRepository = new GetUserByIdRepository();
  const getAvailableEventsRepository = new GetAvailableEventsRepository();
  const getAvailableEventsUseCase = new GetAvailableEventsUseCase(
    getAvailableEventsRepository,
    getUserByIdRepository,
  );
  return getAvailableEventsUseCase;
};

export const makeUpdateEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const updateEventRepository = new UpdateEventRepository();
  const geoCoderProvider = new OpenStreetMapProvider();
  const updateEventUseCase = new UpdateEventUseCase(
    updateEventRepository,
    getEventByIdRepository,
    geoCoderProvider,
  );
  return updateEventUseCase;
};

export const makeEventSubscriptionUseCase = () => {
  const eventSubscriptionRepository = new EventSubscriptionRepository();
  const getEventByIdRepository = new GetEventByIdRepository();
  const getUserSubscribeRepository = new GetUserSubscribeRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const eventSubscriptionUseCase = new EventSubscriptionUseCase(
    eventSubscriptionRepository,
    getEventByIdRepository,
    getUserSubscribeRepository,
    getUserByIdRepository,
    mailProvider,
  );
  return eventSubscriptionUseCase;
};

export const makeGetEventParticipantsUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const getEventParticipantsRepository = new GetEventParticipantsRepository();
  const getEventParticipantsUseCase = new GetEventParticipantsUseCase(
    getEventParticipantsRepository,
    getEventByIdRepository,
  );
  return getEventParticipantsUseCase;
};

export const makeRemoveParticipantFromEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const removeParticipantFromEventRepository =
    new RemoveParticipantFromEventRepository();
  const getUserSubscribeRepository = new GetUserSubscribeRepository();
  const removeParticipantFromEventUseCase =
    new RemoveParticipantFromEventUseCase(
      removeParticipantFromEventRepository,
      getEventByIdRepository,
      getUserSubscribeRepository,
    );
  return removeParticipantFromEventUseCase;
};

export const makeGetUserSubscriptionsUseCase = () => {
  const getUserSubscriptionsRepository = new GetUserSubscriptionsRepository();
  const getUserSubscriptionsUseCase = new GetUserSubscriptionsUseCase(
    getUserSubscriptionsRepository,
  );
  return getUserSubscriptionsUseCase;
};

export const makeCancelEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const updateEventStatusRepository = new UpdateEventStatusRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const cancelEventUseCase = new CancelEventUseCase(
    getEventByIdRepository,
    updateEventStatusRepository,
    mailProvider,
  );
  return cancelEventUseCase;
};

export const makeReopenEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const updateEventStatusRepository = new UpdateEventStatusRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const reopenEventUseCase = new ReopenEventUseCase(
    getEventByIdRepository,
    updateEventStatusRepository,
    mailProvider,
  );
  return reopenEventUseCase;
};

export const makeShareEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const shareEventUseCase = new ShareEventUseCase(getEventByIdRepository);
  return shareEventUseCase;
};
