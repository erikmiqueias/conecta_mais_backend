import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { makeUpdateTicketBatchUseCase } from "../factories/ticket.factories.js";
import { UpdateTicketBatchInputSchema } from "./schemas/ticket.schemas.js";

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
};
