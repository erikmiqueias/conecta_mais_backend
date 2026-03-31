import { z } from "zod";

const EventCoreSchema = {
  name: z.string().trim().min(1, {
    error: "Event name is required",
  }),
  description: z.string().trim().min(1, {
    error: "Event description is required",
  }),
  eventType: z
    .enum(["PRIVATE", "PUBLIC"], {
      error: "Invalid event type",
    })
    .default("PUBLIC"),
  eventAddress: z.string().trim().min(1, {
    error: "Event address is required",
  }),
  startDateTime: z.coerce.date({
    error: "Start date and time must be a valid date",
  }),
  endDateTime: z.coerce.date({
    error: "End date and time must be a valid date",
  }),
};

export const EventSchema = z.object({
  ...EventCoreSchema,
  id: z.uuid({
    error: "Event ID must be a valid UUID",
  }),
  accessCode: z.string().trim().min(1, {
    error: "Access code is required",
  }),
  organizerId: z.uuid({
    error: "Organizer ID must be a valid UUID",
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const CreateEventInputSchema = z.object({
  ...EventCoreSchema,
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  accessCode: z
    .string()
    .trim()
    .min(1, {
      error: "Access code is required for private events",
    })
    .optional(),
});

export const CreateEventOutputSchema = z.object({
  ...EventCoreSchema,
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  accessCode: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  organizerId: z.string(),
});

export const GetOrganizerEventsOutputSchema = z.array(
  z.object({
    ...EventCoreSchema,
    id: z.string(),
  }),
);

export const GetAvailableEventsOutputSchema = z.array(
  z.object({
    ...EventCoreSchema,
    longitude: z.number(),
    latitude: z.number(),
    id: z.string(),
    organizer: z.object({
      id: z.string(),
      username: z.string(),
    }),
  }),
);
