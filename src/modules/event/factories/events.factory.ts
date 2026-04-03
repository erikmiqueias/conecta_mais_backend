import { GetUserByIdRepository } from "@modules/user/repositories/index.js";
import { OpenStreetMapProvider } from "@shared/providers/osm.provider.js";

import {
  EventSubscriptionRepository,
  GetUserSubscribeRepository,
} from "../repositories/index.js";
import {
  CreateEventRepository,
  DeleteEventRepository,
  GetAvailableEventsRepository,
  GetEventByIdRepository,
  GetOrganizerEventsRepository,
  UpdateEventRepository,
} from "../repositories/index.js";
import { EventSubscriptionUseCase } from "../use-cases/event-subscription.use-case.js";
import {
  CreateEventUseCase,
  DeleteEventUseCase,
  GetAvailableEventsUseCase,
  GetOrganizerEventsUseCase,
  UpdateEventUseCase,
} from "../use-cases/index.js";

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
