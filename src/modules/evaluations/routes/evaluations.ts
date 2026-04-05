import { ErrorSchema } from "@schemas/error.schema.js";
import {
  EvaluationNotDisposibleError,
  EventNotFoundError,
  OrganizerCannotReviewOwnEventError,
  UserAlreadyReviewedError,
} from "@shared/errors/errors.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { makeCreateEventReviewUseCase } from "../factories/evaluations.factory.js";
import { CreateEventReviewInputSchema } from "../schemas/evaluations.schemas.js";

export const evaluationsRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/events/:eventId/review",
    onRequest: [app.authenticate],
    schema: {
      security: [{ bearerAuth: [] }],
      tags: ["Event"],
      params: z.object({
        eventId: z.uuid({
          error: "Event ID must be a valid UUID",
        }),
      }),
      body: CreateEventReviewInputSchema,
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
      const userId = request.user.sub;

      const createEventReviewUseCase = makeCreateEventReviewUseCase();

      try {
        await createEventReviewUseCase.execute(eventId, userId, request.body);
        return reply.status(204).send(null);
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "EVENT_NOT_FOUND",
          });
        }

        if (error instanceof UserAlreadyReviewedError) {
          return reply.status(400).send({
            message: error.message,
            code: "USER_ALREADY_REVIEWED",
          });
        }

        if (error instanceof EvaluationNotDisposibleError) {
          return reply.status(400).send({
            message: error.message,
            code: "EVALUATION_NOT_DISPOSIBLE",
          });
        }

        if (error instanceof OrganizerCannotReviewOwnEventError) {
          return reply.status(403).send({
            message: error.message,
            code: "ORGANIZER_CANNOT_REVIEW_OWN_EVENT",
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
