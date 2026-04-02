import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export const fastifySetupConfig = async (app: FastifyInstance) => {
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
          return reply.status(403).send({
            message: "Only organizers can access this resource",
            code: "FORBIDDEN",
          });
        }
      } catch (error) {
        app.log.error(error);
        return reply
          .status(401)
          .send({ message: "Unauthorized", code: "UNAUTHORIZED" });
      }
    },
  );

  if (process.env.NODE_ENV !== "production") {
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
        tags: [
          {
            name: "Auth",
            description: "Endpoints relacionados à autenticação",
          },
          { name: "User", description: "Endpoints relacionados aos usuários" },
          { name: "Event", description: "Endpoints relacionados aos eventos" },
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

    await app.register(fastifyApiReference, {
      routePrefix: "/docs",
      openApiDocumentEndpoints: {
        json: "/docs.json",
        yaml: "/docs.yaml",
      },
    });
  }
};
