import { evaluationsRoutes } from "@modules/evaluations/http/evaluations.routes.js";
import { eventRoutes } from "@modules/event/http/event.routes.js";
import { userRoutes } from "@modules/user/http/user.routes.js";
import { FastifyInstance } from "fastify";
export const registerRoutes = (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: "/users" });
  app.register(eventRoutes, { prefix: "/events" });
  app.register(evaluationsRoutes, { prefix: "/evaluations" });
};
