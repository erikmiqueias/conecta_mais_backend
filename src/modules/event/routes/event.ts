import { GetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.repo.js";
import { ErrorSchema } from "@schemas/error.schema.js";
import {
  AddressNotFoundError,
  CoordinatesNotFoundError,
  EventNotFoundError,
  OSMProviderError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { verifyOptionalJwt } from "@shared/middlewares/verify-optional-jwt.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { OpenStreetMapProvider } from "../../../shared/osm.provider.js";
import { CreateEventRepository } from "../repositories/create-event.repo.js";
import { DeleteEventRepository } from "../repositories/delete-event.repo.js";
import { GetAvailableEventsRepository } from "../repositories/get-available-events.repo.js";
import { GetEventByIdRepository } from "../repositories/get-event-by-id.repo.js";
import { GetOrganizerEventsRepository } from "../repositories/get-organizer-events.repo.js";
import {
  CreateEventInputSchema,
  CreateEventOutputSchema,
  GetAvailableEventsOutputSchema,
  GetOrganizerEventsOutputSchema,
} from "../schemas/event.schema.js";
import { CreateEventUseCase } from "../use-cases/create-event.use-case.js";
import { DeleteEventUseCase } from "../use-cases/delete-event.use-case.js";
import { GetAvailableEventsUseCase } from "../use-cases/get-available-events.use-case.js";
import { GetOrganizerEventsUseCase } from "../use-cases/get-organizer-events.use-case.js";

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

      try {
        const createEventRepository = new CreateEventRepository();
        const getUserByIdRepository = new GetUserByIdRepository();
        const geoCoderProvider = new OpenStreetMapProvider();
        const createEventUseCase = new CreateEventUseCase(
          createEventRepository,
          getUserByIdRepository,
          geoCoderProvider,
        );
        const event = await createEventUseCase.execute(request.body, userId);
        return reply.status(201).send(event);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: "User not found",
            code: "USER_NOT_FOUND",
          });
        }

        if (error instanceof AddressNotFoundError) {
          return reply.status(404).send({
            message: "Address not found",
            code: "ADDRESS_NOT_FOUND",
          });
        }

        if (error instanceof CoordinatesNotFoundError) {
          return reply.status(404).send({
            message: "Coordinates not found",
            code: "COORDINATES_NOT_FOUND",
          });
        }

        if (error instanceof OSMProviderError) {
          return reply.status(502).send({
            message: "Error with geocoding service",
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
      const userId = request.user.sub;

      const getEventByIdRepository = new GetEventByIdRepository();

      const isOwner = await getEventByIdRepository.execute(eventId);

      if (isOwner?.organizerId !== userId) {
        return reply.status(403).send({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }
      const deleteEventRepository = new DeleteEventRepository();
      const deleteEventUseCase = new DeleteEventUseCase(
        getEventByIdRepository,
        deleteEventRepository,
      );
      try {
        await deleteEventUseCase.execute(eventId);
        return reply.status(204).send(null);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: "Event not found",
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

      const getUserByIdRepository = new GetUserByIdRepository();
      const getOrganizerEventsRepository = new GetOrganizerEventsRepository();
      const getOrganizerEventsUseCase = new GetOrganizerEventsUseCase(
        getOrganizerEventsRepository,
        getUserByIdRepository,
      );
      try {
        const events = await getOrganizerEventsUseCase.execute(organizerId);
        return reply.status(200).send(events);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: "User not found",
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
      const getUserByIdRepository = new GetUserByIdRepository();
      const getAvailableEventsRepository = new GetAvailableEventsRepository();
      const getAvailableEventsUseCase = new GetAvailableEventsUseCase(
        getAvailableEventsRepository,
        getUserByIdRepository,
      );

      try {
        const events = await getAvailableEventsUseCase.execute(loggedUser);
        return reply.status(200).send(events);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: "User not found",
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
};
