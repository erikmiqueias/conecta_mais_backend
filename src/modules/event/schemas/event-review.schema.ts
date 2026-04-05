import { z } from "zod";

const EventReviewCoreSchema = {
  rating: z.number().min(1).max(5),
  comment: z.string().trim().min(1, {
    error: "Review comment is required",
  }),
};

export const EventReviewSchema = z.object({
  ...EventReviewCoreSchema,
  userId: z.uuid({
    error: "User ID must be a valid UUID",
  }),
  eventId: z.uuid({
    error: "Event ID must be a valid UUID",
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  id: z.uuid({
    error: "Event review ID must be a valid UUID",
  }),
});

export const CreateEventReviewInputSchema = z.object({
  ...EventReviewCoreSchema,
});
