import { Role } from "@generated/prisma/enums.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const verifyUserRole = (requiredRole: Role) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;
    if (role !== requiredRole) {
      return reply.status(403).send({
        message: "Only organizers can access this resource",
        code: "FORBIDDEN",
      });
    }
  };
};
