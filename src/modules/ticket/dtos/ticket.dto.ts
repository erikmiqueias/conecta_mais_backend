import z from "zod";

import {
  GetTicketBatchByIdOutputSchema,
  GetTicketByIdOutputSchema,
  GetUserTicketsOutputSchema,
  ProcessCheckoutOutputSchema,
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

export type OutputProcessCheckoutDTO = z.infer<
  typeof ProcessCheckoutOutputSchema
>;

export type OutputGetUserTicketsDTO = z.infer<
  typeof GetUserTicketsOutputSchema
>;

export type OutputGetTicketByIdDTO = z.infer<typeof GetTicketByIdOutputSchema>;
