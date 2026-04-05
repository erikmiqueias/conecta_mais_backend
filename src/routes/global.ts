import { authRoutes } from "@modules/auth/routes/auth.js";
import { evaluationsRoutes } from "@modules/evaluations/routes/evaluations.js";
import { eventRoutes } from "@modules/event/routes/event.js";
import { userRoutes } from "@modules/user/routes/user.js";
import { FastifyInstance } from "fastify";
export const registerRoutes = (app: FastifyInstance) => {
  app.register(userRoutes);
  app.register(authRoutes);
  app.register(eventRoutes);
  app.register(evaluationsRoutes);
};
