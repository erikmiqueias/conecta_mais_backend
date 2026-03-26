import { z } from "zod";
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

export const LoginUserSchema = UserSchema.pick({ email: true, password: true });
