import { z } from "zod";

import {
  CreateEventInputSchema,
  CreateEventOutputSchema,
} from "../schemas/event.schema.js";
export type InputCreateEventDTO = z.infer<typeof CreateEventInputSchema>;
export type OutputCreateEventDTO = z.infer<typeof CreateEventOutputSchema>;
