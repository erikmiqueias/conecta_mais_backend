import { z } from "zod";

const UserCoreSchema = {
  username: z.string().trim().min(1, {
    error: "Username is required",
  }),
  email: z.email({
    message: "Invalid email",
  }),
  role: z
    .enum(["USER", "ORGANIZER"], {
      error: "Invalid role",
    })
    .default("USER"),
};

export const UserSchema = z.object({
  id: z.uuid({ error: "Invalid UUId" }),
  ...UserCoreSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateUserInputSchema = z.object({
  ...UserCoreSchema,
  password: z.string().min(1).max(8),
});

export const UserOutputSchema = z.object({
  ...UserCoreSchema,
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetUserByEmailOutputSchema = z.object({
  ...UserCoreSchema,
  password: z.string(),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
