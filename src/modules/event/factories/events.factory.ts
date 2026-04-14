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
import { UpdateEventBannerRepository } from "@infra/database/prisma/repositories/event/update-event-banner.repo.js";
import { GetUserByIdRepository } from "@infra/database/prisma/repositories/user/get-user-by-id.repo.js";
import { OpenStreetMapProvider } from "@infra/providers/geocoder/osm.provider.js";
import { CloudinaryProvider } from "@infra/providers/image-upload/cloudinary.provider.js";
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

import { UpdateEventBannerUseCase } from "../use-cases/update-event-banner.use-case.js";

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
  const getUserByIdRepository = new GetUserByIdRepository();
  const deleteEventUseCase = new DeleteEventUseCase(
    getEventByIdRepository,
    deleteEventRepository,
    getUserByIdRepository,
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
  const getUserByIdRepository = new GetUserByIdRepository();
  const updateEventUseCase = new UpdateEventUseCase(
    updateEventRepository,
    getEventByIdRepository,
    getUserByIdRepository,
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
  const getUserByIdRepository = new GetUserByIdRepository();
  const getEventParticipantsUseCase = new GetEventParticipantsUseCase(
    getEventParticipantsRepository,
    getEventByIdRepository,
    getUserByIdRepository,
  );
  return getEventParticipantsUseCase;
};

export const makeRemoveParticipantFromEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const removeParticipantFromEventRepository =
    new RemoveParticipantFromEventRepository();
  const getUserSubscribeRepository = new GetUserSubscribeRepository();
  const removeParticipantFromEventUseCase =
    new RemoveParticipantFromEventUseCase(
      removeParticipantFromEventRepository,
      getEventByIdRepository,
      getUserSubscribeRepository,
      getUserByIdRepository,
    );
  return removeParticipantFromEventUseCase;
};

export const makeGetUserSubscriptionsUseCase = () => {
  const getUserSubscriptionsRepository = new GetUserSubscriptionsRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const getUserSubscriptionsUseCase = new GetUserSubscriptionsUseCase(
    getUserSubscriptionsRepository,
    getUserByIdRepository,
  );
  return getUserSubscriptionsUseCase;
};

export const makeCancelEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const updateEventStatusRepository = new UpdateEventStatusRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const cancelEventUseCase = new CancelEventUseCase(
    getEventByIdRepository,
    updateEventStatusRepository,
    getUserByIdRepository,
    mailProvider,
  );
  return cancelEventUseCase;
};

export const makeReopenEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const updateEventStatusRepository = new UpdateEventStatusRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const mailProvider = new BullMQMailQueueProvider();
  const reopenEventUseCase = new ReopenEventUseCase(
    getEventByIdRepository,
    updateEventStatusRepository,
    getUserByIdRepository,
    mailProvider,
  );
  return reopenEventUseCase;
};

export const makeShareEventUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const shareEventUseCase = new ShareEventUseCase(
    getEventByIdRepository,
    getUserByIdRepository,
  );
  return shareEventUseCase;
};

export const makeUpdateEventBannerUseCase = () => {
  const getEventByIdRepository = new GetEventByIdRepository();
  const uploadImageProvider = new CloudinaryProvider();
  const updateEventBannerRepository = new UpdateEventBannerRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const updateEventBannerUseCase = new UpdateEventBannerUseCase(
    updateEventBannerRepository,
    getEventByIdRepository,
    getUserByIdRepository,
    uploadImageProvider,
  );
  return updateEventBannerUseCase;
};
