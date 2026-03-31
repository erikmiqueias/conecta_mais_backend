import { ErrorSchema } from "@schemas/error.schema.js";
import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
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
    url: "/user/create",
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
      try {
        const user = await createUserUseCase.execute({
          email,
          password,
          role,
          username,
        });

        return reply.status(201).send(user);
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(400).send({
            message: error.message,
            code: "EMAIL_ALREADY_EXISTS",
          });
        }

        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "DELETE",
    url: "/user/me",
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
      try {
        await deleteUserUseCase.execute(userId);

        return reply.status(204).send(null);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/user/me",
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

      try {
        const user = await getUserByIdUseCase.execute(userId);

        return reply.status(200).send(user!);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
        }

        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/user/me",
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

      try {
        const updatedUser = await updateUserUseCase.execute(userId, {
          username: data.username!,
          email: data.email!,
        });

        return reply.status(200).send(updatedUser!);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: error.message,
            code: "NOT_FOUND",
          });
        }
        if (error instanceof EmailAlreadyExistsError) {
          return reply.status(400).send({
            message: error.message,
            code: "EMAIL_ALREADY_EXISTS",
          });
        }
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        return reply.status(500).send({
          message: errorMessage,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
