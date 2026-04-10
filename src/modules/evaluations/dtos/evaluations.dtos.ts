import z from "zod";

import { CreateEventReviewInputSchema } from "../http/schemas/evaluations.schemas.js";

export type InputCreateEventReviewDTO = z.infer<
  typeof CreateEventReviewInputSchema
>;
