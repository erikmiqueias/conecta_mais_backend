import { GetUserByIdRepository } from "@modules/user/repositories/index.js";
import { OpenStreetMapProvider } from "@shared/providers/osm.provider.js";

import { CreateEventReviewRepository } from "../repositories/create-event-review.repo.js";
import { GetUserReviewRepository } from "../repositories/get-user-review.repo.js";
import {
  EventSubscriptionRepository,
  GetEventParticipantsRepository,
  GetUserSubscribeRepository,
  GetUserSubscriptionsRepository,
  RemoveParticipantFromEventRepository,
} from "../repositories/index.js";
import {
  CreateEventRepository,
  DeleteEventRepository,
  GetAvailableEventsRepository,
  GetEventByIdRepository,
  GetOrganizerEventsRepository,
  UpdateEventRepository,
} from "../repositories/index.js";
import { CreateEventReviewUseCase } from "../use-cases/create-event-review.use-case.js";
import { GetUserSubscriptionsUseCase } from "../use-cases/get-user-subscriptions.use-case.js";
import {
  CreateEventUseCase,
  DeleteEventUseCase,
  EventSubscriptionUseCase,
  GetAvailableEventsUseCase,
  GetEventParticipantsUseCase,
  GetOrganizerEventsUseCase,
  UpdateEventUseCase,
} from "../use-cases/index.js";
import { RemoveParticipantFromEventUseCase } from "../use-cases/remove-participant-from-event.use-case.js";

export const makeCreateEventUseCase = () => {
  const createEventRepository = new CreateEventRepository();
  const getUserByIdRepository = new GetUserByIdRepository();
  const geoCoderProvider = new OpenStreetMapProvider();
  const createEventUseCase = new CreateEventUseCase(
    createEventRepository,
    getUserByIdRepository,
    geoCoderProvider,
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
  const eventSubscriptionUseCase = new EventSubscriptionUseCase(
    eventSubscriptionRepository,
    getEventByIdRepository,
    getUserSubscribeRepository,
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
