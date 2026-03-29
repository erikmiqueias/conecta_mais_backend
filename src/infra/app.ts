import Fastify from "fastify";

import { registerRoutes } from "../routes/global.js";
import { fastifySetupConfig } from "./config.js";
export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });

  await fastifySetupConfig(app);
  registerRoutes(app);

  return app;
};
