import { ErrorSchema } from "@shared/schemas/error.schema.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import {
  makeCheckoutTicketUseCase,
  makeUpdateTicketBatchUseCase,
} from "../factories/ticket.factories.js";
import {
  ProcessCheckoutOutputSchema,
  UpdateTicketBatchInputSchema,
} from "./schemas/ticket.schemas.js";

export const ticketRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/:eventId/batches/:batchId",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      tags: ["Ticket"],
      security: [{ bearerAuth: [] }],
      params: z.object({
        eventId: z.uuid({ error: "Invalid UUId format for event ID" }),
        batchId: z.uuid({ error: "Invalid UUId format for batch ID" }),
      }),
      body: UpdateTicketBatchInputSchema,
    },
    handler: async (request, reply) => {
      const { eventId, batchId } = request.params;
      const data = request.body;
      const organizerId = request.user.sub;
      const updateTicketBatchUseCase = makeUpdateTicketBatchUseCase();

      const updatedBatch = await updateTicketBatchUseCase.execute(
        organizerId,
        eventId,
        batchId,
        data,
      );
      return reply.status(200).send(updatedBatch);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/checkout",
    onRequest: [app.authenticate],
    schema: {
      tags: ["Ticket"],
      security: [{ bearerAuth: [] }],
      body: z.object({
        batchId: z.uuid({ error: "Invalid UUId format for batch ID" }),
      }),
      response: {
        200: ProcessCheckoutOutputSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const { batchId } = request.body;
      const checkoutTicketUseCase = makeCheckoutTicketUseCase();

      const result = await checkoutTicketUseCase.execute(userId, batchId);
      return reply.status(200).send(result);
    },
  });
};
