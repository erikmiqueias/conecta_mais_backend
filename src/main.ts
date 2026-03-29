import { buildApp } from "./infra/app.js";

buildApp()
  .then((app) => {
    app.listen({ port: +process.env.PORT! || 3000 });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
