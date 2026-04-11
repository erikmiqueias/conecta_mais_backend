import { ErrorSchema } from "@shared/schemas/error.schema.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import {
  makeGenerateForgotPasswordTokenUseCase,
  makeResetPasswordUseCase,
} from "../factories/auth.factories.js";

export const authRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/password/forgot",
    schema: {
      tags: ["Auth"],
      body: z.object({
        email: z.email({
          error: "Invalid email",
        }),
      }),
      response: {
        204: z.null(),
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { email } = request.body;

      const generateForgotPasswordTokenUseCase =
        makeGenerateForgotPasswordTokenUseCase();

      await generateForgotPasswordTokenUseCase.execute(email);
      return reply.status(204).send(null);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/password/reset",
    schema: {
      tags: ["Auth"],
      body: z.object({
        token: z.uuid({
          error: "Token must be a valid UUID",
        }),
        newPassword: z.string().min(8),
      }),
      response: {
        204: z.null(),
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { token, newPassword } = request.body;

      const resetPasswordUseCase = makeResetPasswordUseCase();

      await resetPasswordUseCase.execute(token, newPassword);

      return reply.status(204).send(null);
    },
  });
};
