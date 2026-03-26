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
import { ErrorSchema } from "../schemas/error.schema.js";
import { UserSchema } from "../schemas/user.schema.js";
import { CreateUserUseCase } from "../usecases/user/create-user.js";
import { DeleteUserUseCase } from "../usecases/user/delete-user.js";

export const userRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/create",
    schema: {
      body: UserSchema.omit({ id: true, createdAt: true, updatedAt: true }),
      response: {
        201: UserSchema.omit({ password: true }),
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
        app.log.error(error);
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
    schema: {
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
};
