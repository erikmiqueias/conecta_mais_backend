import { TicketStatus } from "@generated/prisma/enums.js";
import z from "zod";

const TicketBatchCoreSchema = {
  batchName: z.string({
    error: "Batch name is required and must be a string",
  }),
  totalCapacity: z
    .number({
      error: "Total capacity is required and must be a number",
    })
    .int()
    .positive(),
};

const TicketCoreSchema = {
  status: z.enum(TicketStatus, {
    error: "Status is required and must be a valid TicketStatus",
  }),
};

export const UpdateTicketBatchInputSchema = z.object({
  batchName: TicketBatchCoreSchema.batchName.optional(),
  totalCapacity: TicketBatchCoreSchema.totalCapacity.optional(),
});

export const UpdateTicketBatchOutputSchema = z.object({
  id: z.uuid(),
  eventId: z.string(),
  ...TicketBatchCoreSchema,
});

export const GetTicketBatchByIdOutputSchema = z.object({
  ...TicketBatchCoreSchema,
  soldCount: z.number().int().nonnegative(),
  id: z.uuid(),
  eventId: z.uuid(),
  price: z.number().positive(),
});

export const ProcessCheckoutOutputSchema = z.object({
  id: z.uuid(),
  status: z.enum(TicketStatus),
  userId: z.uuid(),
  ticketBatchId: z.uuid(),
  ticketCode: z.uuid(),
  ticketBatch: z.object({
    id: z.uuid(),
    batchName: z.string(),
    eventId: z.uuid(),
    event: z.object({
      id: z.uuid(),
      name: z.string(),
    }),
  }),
});

export const GetUserTicketsOutputSchema = z.array(
  z.object({
    ...TicketCoreSchema,
    id: z.uuid(),
    ticketBatchId: z.uuid(),
    ticketBatch: z.object({
      id: z.uuid(),
      batchName: z.string(),
      eventId: z.uuid(),
      event: z.object({
        id: z.uuid(),
        name: z.string(),
      }),
    }),
  }),
);

export const GetTicketByIdOutputSchema = z.object({
  ...TicketCoreSchema,
  id: z.uuid(),
  ticketBatchId: z.uuid(),
  userId: z.uuid(),
  ticketCode: z.string(),
  ticketBatch: z.object({
    id: z.uuid(),
    batchName: z.string(),
    eventId: z.uuid(),
    event: z.object({
      id: z.uuid(),
      name: z.string(),
    }),
  }),
});
