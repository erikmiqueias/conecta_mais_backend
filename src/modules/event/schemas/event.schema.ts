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
  latitude: z
    .number({
      error: "Latitude must be a number",
    })
    .refine((value) => value >= -90 && value <= 90, {
      error: "Latitude must be between -90 and 90",
    })
    .optional(),
  longitude: z
    .number({
      error: "Longitude must be a number",
    })
    .refine((value) => value >= -180 && value <= 180, {
      error: "Longitude must be between -180 and 180",
    })
    .optional(),
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
  accessCode: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  organizerId: z.string(),
});
