import { ErrorSchema } from "@schemas/error.schema.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import {
  makeCreateEventReviewUseCase,
  makeGenerateEvaluateQrCodeUseCase,
} from "../factories/evaluations.factory.js";
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

      await createEventReviewUseCase.execute(eventId, userId, request.body);
      return reply.status(204).send(null);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/events/:eventId/evaluation-qrcode",
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
          qrCode: z.string(),
        }),
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const organizerId = request.user.sub;
      const eventId = request.params.eventId;

      const generateEvaluateQrCodeUseCase = makeGenerateEvaluateQrCodeUseCase();

      const qrCode = await generateEvaluateQrCodeUseCase.execute(
        eventId,
        organizerId,
      );

      return reply
        .status(200)
        .send({ qrCode })
        .header("Content-Type", "image/png");
    },
  });
};
