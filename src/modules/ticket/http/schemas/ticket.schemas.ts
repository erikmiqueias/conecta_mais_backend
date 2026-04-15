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
});
