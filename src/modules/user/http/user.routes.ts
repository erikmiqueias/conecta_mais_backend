import { Role } from "@generated/prisma/enums.js";
import { GetUserByEmailRepository } from "@infra/database/prisma/repositories/user/get-user-by-email.repo.js";
import {
  FileIsRequiredError,
  LoginError,
  RefreshTokenError,
} from "@shared/errors/errors.js";
import { ErrorSchema } from "@shared/schemas/error.schema.js";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import {
  makeCreateUserUseCase,
  makeDeleteUserUseCase,
  makeGetUserByIdUseCase,
  makeUpdateUserAvatarUseCase,
  makeUpdateUserUseCase,
} from "../factories/user.factory.js";
import {
  AuthOutputSchema,
  AuthSchema,
  CreateUserInputSchema,
  UserOutputSchema,
} from "./schemas/user.schema.js";

export const userRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "",
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
        200: UserOutputSchema.nullable(),
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
      const updatedUser = await updateUserUseCase.execute(userId, data);

      return reply.status(200).send(updatedUser);
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/login",
    schema: {
      tags: ["Auth"],
      body: AuthSchema,
      response: {
        200: AuthOutputSchema,
        401: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const getUserByEmailRepository = new GetUserByEmailRepository();

      const user = await getUserByEmailRepository.execute(email);

      if (!user) {
        throw new LoginError("Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new LoginError("Invalid email or password");
      }

      const accessToken = await reply.jwtSign(
        {
          sub: user.id,
          role: user.role,
          type: "access",
        },
        {
          expiresIn: "15m",
        },
      );

      const refreshToken = await reply.jwtSign(
        {
          sub: user.id,
          role: user.role,
          type: "refresh",
        },
        {
          expiresIn: "7d",
        },
      );

      return reply.status(200).send({
        tokens: {
          accessToken,
          refreshToken,
        },
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/refresh",
    schema: {
      tags: ["Auth"],
      body: z.object({
        refreshToken: z.jwt({ error: "Invalid refresh token" }),
      }),
      response: {
        200: z.object({
          tokens: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
        }),
        401: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { refreshToken } = request.body;
      let decodedToken;
      try {
        decodedToken = app.jwt.verify<{
          sub: string;
          role: Role;
          type: "access" | "refresh";
        }>(refreshToken);
      } catch (_error) {
        throw new RefreshTokenError("Invalid refresh token");
      }

      if (decodedToken.type !== "refresh") {
        throw new RefreshTokenError("Invalid refresh token");
      }

      const newAccessToken = await reply.jwtSign({
        sub: decodedToken.sub,
        role: decodedToken.role,
        type: "access",
      });

      const newRefreshToken = await reply.jwtSign({
        sub: decodedToken.sub,
        role: decodedToken.role,
        type: "refresh",
      });

      return reply.status(200).send({
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "PATCH",
    url: "/avatar",
    onRequest: app.authenticate,
    schema: {
      tags: ["User"],
      security: [{ bearerAuth: [] }],
      consumes: ["multipart/form-data"],
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

      const data = await request.file();

      if (!data) {
        throw new FileIsRequiredError();
      }

      const fileBuffer = await data?.toBuffer();

      const updateUserAvatarUseCase = makeUpdateUserAvatarUseCase();

      await updateUserAvatarUseCase.execute(userId, fileBuffer);

      return reply.status(204).send(null);
    },
  });
};
