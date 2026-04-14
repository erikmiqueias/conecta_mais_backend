import { FileIsRequiredError } from "@shared/errors/errors.js";
import { verifyOptionalJwt } from "@shared/middlewares/verify-optional-jwt.js";
import { ErrorSchema } from "@shared/schemas/error.schema.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import {
  makeCancelEventUseCase,
  makeCreateEventUseCase,
  makeDeleteEventUseCase,
  makeEventSubscriptionUseCase,
  makeGetAvailableEventsUseCase,
  makeGetEventParticipantsUseCase,
  makeGetOrganizerEventsUseCase,
  makeGetUserSubscriptionsUseCase,
  makeRemoveParticipantFromEventUseCase,
  makeReopenEventUseCase,
  makeShareEventUseCase,
  makeUpdateEventBannerUseCase,
  makeUpdateEventUseCase,
} from "../factories/events.factory.js";
import {
  CreateEventInputSchema,
  CreateEventOutputSchema,
  GetAvailableEventsOutputSchema,
  GetEventParticipantsOutputSchema,
  GetOrganizerEventsOutputSchema,
  GetUserSubscriptionsOutputSchema,
  InputEventSubscriptionSchema,
  UpdateEventInputSchema,
} from "./schemas/event.schema.js";

export const eventRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "",
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
      const event = await createEventUseCase.execute(request.body, userId);

      return reply.status(201).send(event);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:eventId",
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
      const deleteEventUseCase = makeDeleteEventUseCase();
      await deleteEventUseCase.execute(userId, eventId);

      return reply.status(204).send(null);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/me",
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
      const events = await getOrganizerEventsUseCase.execute(organizerId);

      return reply.status(200).send(events);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "",
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
      const events = await getAvailableEventsUseCase.execute(loggedUser);

      return reply.status(200).send(events);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:eventId",
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
      const updatedEvent = await updateEventUseCase.execute(
        eventId,
        userId,
        request.body,
      );

      return reply.status(200).send(updatedEvent);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/:eventId/subscribe",
    onRequest: [app.authenticate],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      params: z.object({
        eventId: z.uuid({
          error: "Event ID must be a valid UUID",
        }),
      }),
      body: z.object({
        accessCode: z.string().trim().min(1).optional(),
      }),
      response: {
        201: InputEventSubscriptionSchema.omit({
          eventId: true,
          userId: true,
        }),
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
      const subscription = await eventSubscriptionUseCase.execute(
        request.params.eventId,
        userId,
        request.body.accessCode,
      );

      return reply.status(201).send(subscription);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:eventId/participants",
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
      const getEventParticipantsUseCase = makeGetEventParticipantsUseCase();
      const participants = await getEventParticipantsUseCase.execute(
        eventId,
        userId,
      );

      return reply.status(200).send(participants);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/:eventId/attendees",
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
        204: z.null(),
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
      const removeParticipantFromEventUseCase =
        makeRemoveParticipantFromEventUseCase();
      await removeParticipantFromEventUseCase.execute(eventId, userId);

      return reply.status(204).send(null);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/me/subscriptions",
    onRequest: [app.authenticate],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      response: {
        200: GetUserSubscriptionsOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const getUserSubscriptionsUseCase = makeGetUserSubscriptionsUseCase();
      const subscriptions = await getUserSubscriptionsUseCase.execute(userId);

      return reply.status(200).send(subscriptions);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:eventId/cancel",
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
      const eventId = request.params.eventId;
      const organizerId = request.user.sub;

      const cancelEventUseCase = makeCancelEventUseCase();

      await cancelEventUseCase.execute(organizerId, eventId);

      return reply.status(204).send(null);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:eventId/reopen",
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
      const eventId = request.params.eventId;
      const organizerId = request.user.sub;
      const reopenEventUseCase = makeReopenEventUseCase();
      await reopenEventUseCase.execute(eventId, organizerId);

      return reply.status(204).send(null);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:eventId/share",
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
        200: z.object({
          shareLink: z
            .url()
            .startsWith("http://")
            .or(z.url().startsWith("https://")),
        }),
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const eventId = request.params.eventId;
      const organizerId = request.user.sub;
      const shareEventUseCase = makeShareEventUseCase();

      const shareLink = await shareEventUseCase.execute(eventId, organizerId);
      return reply.status(200).send({ shareLink });
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:eventId/banner",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      security: [{ bearerAuth: [] }],
      consumes: ["multipart/form-data"],
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
      const userId = request.user.sub;
      const eventId = request.params.eventId;

      const banner = await request.file();

      if (!banner) throw new FileIsRequiredError();

      const bannerBuffer = await banner.toBuffer();

      const updateEventBannerUseCase = makeUpdateEventBannerUseCase();

      await updateEventBannerUseCase.execute(userId, eventId, bannerBuffer);

      return reply.status(204).send(null);
    },
  });
};
