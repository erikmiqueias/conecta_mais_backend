import Fastify from "fastify";

import { fastifySetupConfig } from "./config.js";
import { errorHandler } from "./error-handler.js";
import { registerRoutes } from "./routes.js";
export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  await fastifySetupConfig(app);
  app.setErrorHandler(errorHandler);
  registerRoutes(app);

  return app;
};
