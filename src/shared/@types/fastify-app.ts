import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProviderDefault,
} from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";

export type FastifyApp = FastifyInstance<
  Server<typeof IncomingMessage, typeof ServerResponse>,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
> &
  PromiseLike<
    FastifyInstance<
      Server<typeof IncomingMessage, typeof ServerResponse>,
      IncomingMessage,
      ServerResponse<IncomingMessage>,
      FastifyBaseLogger,
      FastifyTypeProviderDefault
    >
  > & { __linterBrands: "SafePromiseLike" };
