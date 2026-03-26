import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
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

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
});

app.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();

      if (request.user.type !== "access") {
        throw new Error("Invalid token type");
      }
    } catch (error) {
      app.log.error(error);
      return reply
        .status(401)
        .send({ message: "Unauthorized", code: "UNAUTHORIZED" });
    }
  },
);

app.decorate(
  "requireOrganizer",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.role !== "ORGANIZER") {
        return reply
          .status(403)
          .send({ message: "Forbidden", code: "FORBIDDEN" });
      }
    } catch (error) {
      app.log.error(error);
      return reply
        .status(401)
        .send({ message: "Unauthorized", code: "UNAUTHORIZED" });
    }
  },
);

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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
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
