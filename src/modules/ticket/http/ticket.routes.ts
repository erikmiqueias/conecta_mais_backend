import { ErrorSchema } from "@shared/schemas/error.schema.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import z from "zod";

import {
  makeCheckInTicketUseCase,
  makeCheckoutTicketUseCase,
  makeGenerateTicketQRCodeUseCase,
  makeGetUserTicketsUseCase,
  makeUpdateTicketBatchUseCase,
} from "../factories/ticket.factories.js";
import {
  GetUserTicketsOutputSchema,
  ProcessCheckoutOutputSchema,
  UpdateTicketBatchInputSchema,
  UpdateTicketBatchOutputSchema,
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
      response: {
        200: UpdateTicketBatchOutputSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
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
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/me",
    onRequest: [app.authenticate],
    schema: {
      tags: ["Ticket"],
      security: [{ bearerAuth: [] }],
      response: {
        200: GetUserTicketsOutputSchema,
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;

      const getUserTicketsUseCase = makeGetUserTicketsUseCase();
      const tickets = await getUserTicketsUseCase.execute(userId);
      return reply.status(200).send(tickets);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:ticketId/qrcode",
    onRequest: [app.authenticate],
    schema: {
      tags: ["Ticket"],
      security: [{ bearerAuth: [] }],
      params: z.object({
        ticketId: z.uuid({ error: "Invalid UUId format for ticket ID" }),
      }),
      response: {
        200: z.object({
          ticketId: z.uuid(),
          qrCode: z.string(),
          ticketCode: z.string(),
        }),
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const { ticketId } = request.params;

      const generateTicketQRCodeUseCase = makeGenerateTicketQRCodeUseCase();
      const qrCodeData = await generateTicketQRCodeUseCase.execute(
        userId,
        ticketId,
      );
      return reply.status(200).send(qrCodeData);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/check-in",
    onRequest: [app.authenticate, app.requireOrganizer],
    schema: {
      tags: ["Ticket"],
      security: [{ bearerAuth: [] }],
      body: z.object({
        ticketQrCodeString: z.jwt({
          error: "Invalid JWT format for ticket QR code",
        }),
      }),
      response: {
        204: z.null(),
        400: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const organizerId = request.user.sub;
      const { ticketQrCodeString } = request.body;

      const verifyCheckInJwt = jwt.verify(
        ticketQrCodeString,
        process.env.TICKET_QR_CODE_SECRET!,
      );

      if (
        typeof verifyCheckInJwt !== "object" ||
        !verifyCheckInJwt.ticketCode
      ) {
        return reply
          .status(400)
          .send({ message: "Invalid QR code", code: "INVALID_QR_CODE" });
      }

      const ticketId = verifyCheckInJwt.sub;

      if (!ticketId) {
        return reply.status(400).send({
          message: "Invalid QR code: missing ticket ID",
          code: "INVALID_QR_CODE",
        });
      }

      const checkInTicketUseCase = makeCheckInTicketUseCase();

      await checkInTicketUseCase.execute(organizerId, ticketId);

      return reply.status(204).send(null);
    },
  });
};
