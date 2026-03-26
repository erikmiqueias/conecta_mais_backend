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
  username: z.string().trim().min(1, {
    error: "Username is required",
  }),
  email: z.email({
    message: "Invalid email",
  }),
  password: z
    .string()
    .min(1, {
      error: "Password is required",
    })
    .max(8, {
      error: "Password must be less than 8 characters",
    }),
  role: z
    .enum(["USER", "ORGANIZER"], {
      error: "Invalid role",
    })
    .default("USER"),
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

export const LoginUserSchema = UserSchema.pick({ email: true, password: true });
