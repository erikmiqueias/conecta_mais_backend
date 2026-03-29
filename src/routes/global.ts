import { authRoutes } from "@modules/auth/routes/auth.js";
import { userRoutes } from "@modules/user/routes/user.js";
import { FastifyApp } from "@shared/@types/fastify-app.js";
export const registerRoutes = (app: FastifyApp) => {
  app.register(userRoutes);
  app.register(authRoutes);
};
