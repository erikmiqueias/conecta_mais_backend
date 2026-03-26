import "@fastify/jwt";
import "fastify";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: "USER" | "ORGANIZER";
      type: "access" | "refresh";
    };
    user: {
      sub: string;
      role: "USER" | "ORGANIZER";
      type: "access" | "refresh";
    };
  }
}

declare module "fastify" {
  export interface FastifyInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requireOrganizer: any;
  }
}
