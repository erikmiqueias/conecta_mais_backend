import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { CreateUserRepository } from "../repositories/user/create-user.js";
import { GetUserByEmailRepository } from "../repositories/user/get-user-by-email.js";
import { ErrorSchema } from "../schemas/error.schema.js";
import { ResponseUserSchema, UserSchema } from "../schemas/user.schema.js";
import { CreateUserUseCase } from "../usecases/user/create-user.js";

export const userRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/create",
    schema: {
      body: UserSchema.omit({ id: true, createdAt: true, updatedAt: true }),
      response: {
        201: ResponseUserSchema,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        app.log.error(error);

        return reply.status(500).send({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
