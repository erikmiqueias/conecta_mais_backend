import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { authRoutes } from "./routes/auth.js";
import { userRoutes } from "./routes/user.js";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Conecta + Backend API",
      description: "Servidor para a aplicação Conecta +",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Servidor de desenvolvimento",
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  transform: jsonSchemaTransform,

  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
});

await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});
app.register(userRoutes);
app.register(authRoutes);
try {
  await app.listen({ port: +process.env.PORT! || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
