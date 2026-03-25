import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { Role } from "../generated/prisma/enums.js";
import { generateToken, verifyToken } from "../helpers/tokens.js";
import { GetUserByEmailRepository } from "../repositories/user/get-user-by-email.js";
import { ErrorSchema } from "../schemas/error.schema.js";
import { LoginUserSchema, ResponseUserSchema } from "../schemas/user.schema.js";
export const authRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/auth/login",
    schema: {
      body: LoginUserSchema,
      response: {
        200: z.object({
          tokens: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
          user: ResponseUserSchema.pick({
            id: true,
            username: true,
            role: true,
          }),
        }),
        401: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const getUserByEmailRepository = new GetUserByEmailRepository();

      try {
        const user = await getUserByEmailRepository.execute(email);

        if (!user) {
          return reply.status(404).send({
            message: "User not found",
            code: "NOT_FOUND",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return reply.status(401).send({
            message: "Invalid email or password",
            code: "UNAUTHORIZED",
          });
        }

        return reply.status(200).send({
          tokens: {
            ...generateToken(user.id, user.role),
          },
          user,
        });
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return reply.status(401).send({
            message: error.message,
            code: "UNAUTHORIZED",
          });
        }

        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user/auth/refresh-token",
    schema: {
      body: z.object({
        refreshToken: z.string(),
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
    handler: async (request, resply) => {
      const { refreshToken } = request.body;

      try {
        const validToken = verifyToken(refreshToken) as {
          userId: string;
          role: Role;
        };
        const tokens = generateToken(validToken.userId, validToken.role);

        return resply.status(200).send({
          tokens,
        });
      } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
          return resply.status(401).send({
            message: error.message,
            code: "UNAUTHORIZED",
          });
        }

        return resply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
