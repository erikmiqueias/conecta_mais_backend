import { authRoutes } from "@modules/auth/routes/auth.js";
import { userRoutes } from "@modules/user/routes/user.js";
import Fastify from "fastify";
export const registerRoutes = (app: ReturnType<typeof Fastify>) => {
  app.register(userRoutes);
  app.register(authRoutes);
};
