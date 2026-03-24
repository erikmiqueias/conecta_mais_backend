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

import { ErrorSchema, UserSchema } from "./schemas/index.js";
import { CreateUserUseCase } from "./usecases/user/create-user.js";

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

app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/user/create",
  schema: {
    body: UserSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    response: {
      201: UserSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
  },
  handler: async (request, reply) => {
    const { email, password, role, username } = request.body;
    const createUserUseCase = new CreateUserUseCase();
    try {
      const user = await createUserUseCase.execute({
        email,
        password,
        role,
        username,
      });

      return reply.status(201).send(user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      app.log.error(error);

      return reply.status(500).send({
        message: error.message,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  },
});

try {
  await app.listen({ port: +process.env.PORT! || 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
