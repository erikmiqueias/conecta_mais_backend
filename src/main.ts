import { buildApp } from "./infra/app.js";
async function startServer() {
  try {
    const app = await buildApp();

    const port = Number(process.env.PORT) || 3000;
    const address = await app.listen({ port });
    app.log.info(`API documentation available at ${address}/docs`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
