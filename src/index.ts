import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
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

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  schema: {
    description: "Hello world",
    tags: ["Hello World"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return { message: "Hello world" };
  },
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/user",
  schema: {
    description: "Route to create a user",
    tags: ["User"],
    body: z.object({
      username: z.string(),
      email: z.email(),
      password: z.string().min(8),
      role: z.enum(["user", "organizer"]),
    }),
    response: {
      200: z.object({
        message: z.string(),
        code: z.number(),
      }),
      201: z.object({
        message: z.string(),
        code: z.number(),
      }),
      401: z.object({
        message: z.string(),
        code: z.number(),
      }),
      500: z.object({
        message: z.string(),
        code: z.number(),
      }),
    },
  },
  handler: () => {},
});

try {
  await app.listen({ port: +process.env.PORT! || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
