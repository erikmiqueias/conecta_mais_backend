import { z } from "zod";

import {
  CreateEventInputSchema,
  CreateEventOutputSchema,
  GetAvailableEventsOutputSchema,
  GetEventParticipantsOutputSchema,
  GetOrganizerEventsOutputSchema,
  GetUserSubscriptionsOutputSchema,
  UpdateEventInputSchema,
  UpdateEventOutputSchema,
} from "../http/schemas/event.schema.js";
export type InputCreateEventDTO = z.infer<typeof CreateEventInputSchema>;
export type OutputCreateEventDTO = z.infer<typeof CreateEventOutputSchema>;
export type InputGetOrganizerEventsDTO = string;
export type OutputGetOrganizerEventsDTO = z.infer<
  typeof GetOrganizerEventsOutputSchema
>;
export type OutputGetAvailableEventsDTO = z.infer<
  typeof GetAvailableEventsOutputSchema
>;

export type InputUpdateEventDTO = z.infer<typeof UpdateEventInputSchema>;
export type OutputUpdateEventDTO = z.infer<typeof UpdateEventOutputSchema>;

export type OutputEventSubscriptionDTO = {
  id: string;
  subscriptionDateTime: Date;
};

export type OutputGetEventParticipantsDTO = z.infer<
  typeof GetEventParticipantsOutputSchema
>;
export type OutputGetUserSubscriptionsDTO = z.infer<
  typeof GetUserSubscriptionsOutputSchema
>;
