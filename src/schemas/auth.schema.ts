import { UserSchema } from "@modules/user/schemas/user.schema.js";
import { z } from "zod";

export const AuthCoreSchema = {
  email: z.email({
    message: "Invalid email or password",
  }),
  password: z.string().min(1).max(8),
};

export const AuthSchema = z.object({
  ...AuthCoreSchema,
});

export const AuthOutputSchema = z.object({
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  user: UserSchema.pick({
    id: true,
    username: true,
    role: true,
  }),
});
