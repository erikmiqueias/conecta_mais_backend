import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import {
  EmailAlreadyExistsError,
  UserNotFoundError,
} from "../errors/errors.js";
import { CreateUserRepository } from "../repositories/user/create-user.js";
import { DeleteUserRepository } from "../repositories/user/delete-user.js";
import { GetUserByEmailRepository } from "../repositories/user/get-user-by-email.js";
import { GetUserByIdRepository } from "../repositories/user/get-user-by-id.js";
import { UpdateUserRepository } from "../repositories/user/update-user.js";
import { ErrorSchema } from "../schemas/error.schema.js";
import {
  CreateUserInputSchema,
  UserOutputSchema,
} from "../schemas/user.schema.js";
import { CreateUserUseCase } from "../usecases/user/create-user.js";
import { DeleteUserUseCase } from "../usecases/user/delete-user.js";
import { GetUserByIdUseCase } from "../usecases/user/get-user-by-id.js";
import { UpdateUserUseCase } from "../usecases/user/update-user.js";

export const userRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/create",
    schema: {
      body: CreateUserInputSchema,
      response: {
        201: UserOutputSchema,
        400: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password, role, username } = request.body;
      const getUserByEmailRepository = new GetUserByEmailRepository();
      const createUserRepository = new CreateUserRepository();
      const createUserUseCase = new CreateUserUseCase(
        createUserRepository,
        getUserByEmailRepository,
      );
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
    url: "/user/:userId",
    onRequest: app.authenticate,
    schema: {
      security: [{ bearerAuth: [] }],
      params: z.object({
        userId: z.uuid({ error: "Invalid UUId" }),
      }),
      response: {
        200: z.object({
          message: z.string(),
          code: z.string(),
        }),
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { userId } = request.params;

      const loggedInUser = request.user.sub;

      if (loggedInUser !== userId) {
        return reply.status(401).send({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const deleteUserRepository = new DeleteUserRepository();
      const getUserByIdRepository = new GetUserByIdRepository();
      const deleteUserUseCase = new DeleteUserUseCase(
        getUserByIdRepository,
        deleteUserRepository,
      );

      try {
        const deletedUser = await deleteUserUseCase.execute(userId);

        return reply.status(200).send({
          message: deletedUser ? "User deleted" : "An error occurred",
          code: "OK",
        });
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
    url: "/user/:userId",
    onRequest: app.authenticate,
    schema: {
      security: [{ bearerAuth: [] }],
      params: z.object({
        userId: z.uuid({ error: "Invalid UUId" }),
      }),
      response: {
        200: UserOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { userId } = request.params;

      const loggedInUser = request.user.sub;

      if (loggedInUser !== userId) {
        return reply.status(401).send({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }

      const getUserByIdRepository = new GetUserByIdRepository();
      const getUserByIdUseCase = new GetUserByIdUseCase(getUserByIdRepository);

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
    url: "/user/:userId",
    onRequest: app.authenticate,
    schema: {
      security: [{ bearerAuth: [] }],
      params: z.object({
        userId: z.uuid({ error: "Invalid UUId" }),
      }),
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
      const { userId } = request.params;
      if (userId !== request.user.sub) {
        return reply.status(401).send({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }
      const { data } = request.body;

      const getUserByEmailRepository = new GetUserByEmailRepository();
      const getUserByIdRepository = new GetUserByIdRepository();
      const updateUserRepository = new UpdateUserRepository();
      const updateUserUseCase = new UpdateUserUseCase(
        updateUserRepository,
        getUserByIdRepository,
        getUserByEmailRepository,
      );
      try {
        const invalidFields = Object.keys(data).some(
          (key) => !["email", "username"].includes(key),
        );

        if (invalidFields) {
          return reply.status(400).send({
            message: "Invalid fields in request body",
            code: "INVALID_FIELDS",
          });
        }

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
