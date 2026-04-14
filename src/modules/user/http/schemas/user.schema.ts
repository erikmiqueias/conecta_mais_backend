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
  password: z.string().min(8),
  verificationToken: z.string().optional(),
  verificationTokenExpiry: z.date().optional(),
});

export const UserOutputSchema = z.object({
  id: z.uuid({ error: "Invalid UUId" }),
  email: z.email({
    message: "Invalid email",
  }),
  username: z.string().trim().min(1, {
    error: "Username is required",
  }),
  emailVerified: z.boolean(),
});

export const GetUserByEmailOutputSchema = z.object({
  ...UserCoreSchema,
  password: z.string(),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateUserInputSchema = z.object({
  email: z
    .email({
      message: "Invalid email",
    })
    .optional(),
  username: z
    .string()
    .trim()
    .min(1, {
      error: "Username is required",
    })
    .optional(),
});

export const UpdateUserOutputSchema = z.object({
  ...UserCoreSchema,
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  emailVerified: z.boolean(),
});

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
