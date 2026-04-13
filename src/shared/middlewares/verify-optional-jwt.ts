import { FastifyReply, FastifyRequest } from "fastify";

export const verifyOptionalJwt = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  try {
    await request.jwtVerify();
  } catch (_error) {
    // do nothing
  }
};
