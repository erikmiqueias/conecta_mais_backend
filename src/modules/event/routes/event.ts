import { ErrorSchema } from "@schemas/error.schema.js";
import {
  AddressNotFoundError,
  CoordinatesNotFoundError,
  EventNotAuthorizedError,
  EventNotFoundError,
  OSMProviderError,
  UserAlreadySubscribedError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { verifyOptionalJwt } from "@shared/middlewares/verify-optional-jwt.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import {
  makeCreateEventUseCase,
  makeDeleteEventUseCase,
  makeEventSubscriptionUseCase,
  makeGetAvailableEventsUseCase,
  makeGetOrganizerEventsUseCase,
  makeUpdateEventUseCase,
} from "../factories/events.factory.js";
import { GetEventByIdRepository } from "../repositories/get-event-by-id.repo.js";
import { GetEventParticipantsRepository } from "../repositories/get-event-participants.repo.js";
import {
  CreateEventInputSchema,
  CreateEventOutputSchema,
  GetAvailableEventsOutputSchema,
  GetEventParticipantsOutputSchema,
  GetOrganizerEventsOutputSchema,
  InputEventSubscriptionSchema,
  UpdateEventInputSchema,
} from "../schemas/event.schema.js";
import { GetEventParticipantsUseCase } from "../use-cases/get-event-participants.use-case.js";

export const eventRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/me/events",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      tags: ["Event"],
      security: [{ bearerAuth: [] }],
      body: CreateEventInputSchema.omit({
        latitude: true,
        longitude: true,
        accessCode: true,
      }),
      response: {
        201: CreateEventOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
        502: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const createEventUseCase = makeCreateEventUseCase();

      try {
        const event = await createEventUseCase.execute(request.body, userId);
        return reply.status(201).send(event);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "USER_NOT_FOUND",
          });
        }

        if (error instanceof AddressNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "ADDRESS_NOT_FOUND",
          });
        }

        if (error instanceof CoordinatesNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "COORDINATES_NOT_FOUND",
          });
        }

        if (error instanceof OSMProviderError) {
          return reply.status(502).send({
            message: error.message,
            code: "GEOCODING_SERVICE_ERROR",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/me/events/:eventId",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      params: z.object({
        eventId: z.uuid({
          error: "Event ID must be a valid UUID",
        }),
      }),
      response: {
        204: z.null(),
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { eventId } = request.params;
      const deleteEventUseCase = makeDeleteEventUseCase();

      try {
        await deleteEventUseCase.execute(eventId);
        return reply.status(204).send(null);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/me/events",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      response: {
        200: GetOrganizerEventsOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        403: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const organizerId = request.user.sub;

      const getOrganizerEventsUseCase = makeGetOrganizerEventsUseCase();
      try {
        const events = await getOrganizerEventsUseCase.execute(organizerId);
        return reply.status(200).send(events);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "USER_NOT_FOUND",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/events",
    preHandler: verifyOptionalJwt,
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      response: {
        200: GetAvailableEventsOutputSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const loggedUser = request.user?.sub || undefined;
      const getAvailableEventsUseCase = makeGetAvailableEventsUseCase();

      try {
        const events = await getAvailableEventsUseCase.execute(loggedUser);
        return reply.status(200).send(events);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "USER_NOT_FOUND",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/me/events/:eventId",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      params: z.object({
        eventId: z.uuid({
          error: "Event ID must be a valid UUID",
        }),
      }),
      body: UpdateEventInputSchema,
      response: {
        200: UpdateEventInputSchema.omit({ accessCode: true }),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        403: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { eventId } = request.params;
      const userId = request.user.sub;

      const updateEventUseCase = makeUpdateEventUseCase();
      try {
        const updatedEvent = await updateEventUseCase.execute(
          eventId,
          userId,
          request.body,
        );
        return reply.status(200).send(updatedEvent);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "EVENT_NOT_FOUND",
          });
        }
        if (error instanceof EventNotAuthorizedError) {
          return reply.status(403).send({
            message: error.message,
            code: "EVENT_NOT_AUTHORIZED",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/events/:eventId/join",
    onRequest: [app.authenticate],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      params: z.object({
        eventId: z.uuid({
          error: "Event ID must be a valid UUID",
        }),
      }),
      response: {
        201: InputEventSubscriptionSchema.omit({ eventId: true, userId: true }),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        409: ErrorSchema,
        500: ErrorSchema,
      },
    },

    handler: async (request, reply) => {
      const userId = request.user.sub;

      const eventSubscriptionUseCase = makeEventSubscriptionUseCase();

      try {
        const subscription = await eventSubscriptionUseCase.execute(
          request.params.eventId,
          userId,
        );

        return reply.status(201).send(subscription);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "EVENT_NOT_FOUND",
          });
        }

        if (error instanceof UserAlreadySubscribedError) {
          return reply.status(409).send({
            message: error.message,
            code: "USER_ALREADY_SUBSCRIBED",
          });
        }
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/events/:eventId/subscriptions",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      params: z.object({
        eventId: z.uuid({
          error: "Event ID must be a valid UUID",
        }),
      }),
      response: {
        200: GetEventParticipantsOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        403: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const eventId = request.params.eventId;
      const userId = request.user.sub;

      const getEventByIdRepository = new GetEventByIdRepository();
      const getEventParticipantsRepository =
        new GetEventParticipantsRepository();
      const getEventParticipantsUseCase = new GetEventParticipantsUseCase(
        getEventParticipantsRepository,
        getEventByIdRepository,
      );

      try {
        const participants = await getEventParticipantsUseCase.execute(
          eventId,
          userId,
        );
        return reply.status(200).send(participants);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "EVENT_NOT_FOUND",
          });
        }

        if (error instanceof EventNotAuthorizedError) {
          return reply.status(403).send({
            message: error.message,
            code: "EVENT_NOT_AUTHORIZED",
          });
        }

        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
