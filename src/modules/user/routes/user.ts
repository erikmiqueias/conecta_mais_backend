import { ErrorSchema } from "@schemas/error.schema.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import {
  makeCreateUserUseCase,
  makeDeleteUserUseCase,
  makeGetUserByIdUseCase,
  makeUpdateUserUseCase,
} from "../factories/user.factory.js";
import {
  CreateUserInputSchema,
  UserOutputSchema,
} from "../schemas/user.schema.js";

export const userRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/users",
    schema: {
      tags: ["User"],
      body: CreateUserInputSchema,
      response: {
        201: UserOutputSchema,
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password, role, username } = request.body;
      const createUserUseCase = makeCreateUserUseCase();
      const user = await createUserUseCase.execute({
        email,
        password,
        role,
        username,
      });

      return reply.status(201).send(user);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/me",
    onRequest: app.authenticate,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      response: {
        204: z.null(),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const deleteUserUseCase = makeDeleteUserUseCase();
      await deleteUserUseCase.execute(userId);

      return reply.status(204).send(null);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/me",
    onRequest: app.authenticate,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      response: {
        200: UserOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const getUserByIdUseCase = makeGetUserByIdUseCase();
      const user = await getUserByIdUseCase.execute(userId);

      return reply.status(200).send(user!);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/me",
    onRequest: app.authenticate,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      body: z.object({
        data: z.object({
          username: z.string().optional(),
          email: z
            .email({
              error: "Invalid email address",
            })
            .optional(),
        }),
      }),
      response: {
        200: UserOutputSchema.omit({ createdAt: true }),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const userId = request.user.sub;
      const { data } = request.body;
      const updateUserUseCase = makeUpdateUserUseCase();
      const updatedUser = await updateUserUseCase.execute(userId, {
        username: data.username!,
        email: data.email!,
      });

      return reply.status(200).send(updatedUser!);
    },
  });
};
