import z from "zod";

import {
  GetTicketBatchByIdOutputSchema,
  UpdateTicketBatchInputSchema,
  UpdateTicketBatchOutputSchema,
} from "../http/schemas/ticket.schemas.js";

export type InputTicketBatchDTO = z.infer<typeof UpdateTicketBatchInputSchema>;
export type OutputTicketBatchDTO = z.infer<
  typeof UpdateTicketBatchOutputSchema
>;
export type OutputGetTicketBatchByIdDTO = z.infer<
  typeof GetTicketBatchByIdOutputSchema
>;
