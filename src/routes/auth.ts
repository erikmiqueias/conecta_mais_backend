import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { Role } from "../generated/prisma/enums.js";
import { GetUserByEmailRepository } from "../repositories/user/get-user-by-email.js";
import { ErrorSchema } from "../schemas/error.schema.js";
import { LoginUserSchema, UserSchema } from "../schemas/user.schema.js";
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
          user: UserSchema.pick({
            id: true,
            username: true,
            role: true,
          }),
        }),
        401: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const getUserByEmailRepository = new GetUserByEmailRepository();

      try {
        const user = await getUserByEmailRepository.execute(email);

        if (!user) {
          return reply.status(401).send({
            message: "Invalid email or password",
            code: "UNAUTHORIZED",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return reply.status(401).send({
            message: "Invalid email or password",
            code: "UNAUTHORIZED",
          });
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
      } catch (error) {
        app.log.error(error);
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
      try {
        const decodedToken = app.jwt.verify<{
          sub: string;
          role: Role;
          type: "access" | "refresh";
        }>(refreshToken);

        if (decodedToken.type !== "refresh") {
          return reply.status(401).send({
            message: "Invalid refresh token",
            code: "UNAUTHORIZED",
          });
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
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  });
};
