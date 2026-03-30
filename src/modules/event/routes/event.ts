import { GetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.repo.js";
import { ErrorSchema } from "@schemas/error.schema.js";
import { UserNotFoundError } from "@shared/errors/errors.js";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import { OpenStreetMapProvider } from "../providers/osm.provider.js";
import { CreateEventRepository } from "../repositories/create-event.repo.js";
import {
  CreateEventInputSchema,
  CreateEventOutputSchema,
} from "../schemas/event.schema.js";
import { CreateEventUseCase } from "../use-cases/create-event.use-case.js";

export const eventRoutes = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/event/:userId/create",
    onRequest: app.authenticate,
    schema: {
      tags: ["Event"],
      security: [{ bearerAuth: [] }],
      params: z.object({
        userId: z.uuid({
          error: "User ID must be a valid UUID",
        }),
      }),
      body: CreateEventInputSchema,
      response: {
        201: CreateEventOutputSchema,
        400: ErrorSchema,
        401: ErrorSchema,
        403: ErrorSchema,
        404: ErrorSchema,
        500: ErrorSchema,
      },
    },
    handler: async (request, reply) => {
      const { userId } = request.params;
      const loggedUser = request.user.sub;
      const loggedUserRole = request.user.role;
      if (loggedUser !== userId) {
        return reply.status(403).send({
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        });
      }
      if (loggedUserRole !== "ORGANIZER") {
        return reply.status(403).send({
          message: "Only organizers can create events",
          code: "FORBIDDEN",
        });
      }

      try {
        const createEventRepository = new CreateEventRepository();
        const getUserByIdRepository = new GetUserByIdRepository();
        const geoCoderProvider = new OpenStreetMapProvider();
        const createEventUseCase = new CreateEventUseCase(
          createEventRepository,
          getUserByIdRepository,
          geoCoderProvider,
        );
        const event = await createEventUseCase.execute(request.body, userId);
        return reply.status(201).send(event);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({
            message: "User not found",
            code: "USER_NOT_FOUND",
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
