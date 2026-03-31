import { FastifyReply, FastifyRequest } from "fastify";

export const verifyOptionalJwt = async (
  request: FastifyRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reply: FastifyReply,
) => {
  try {
    await request.jwtVerify();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // If the token is invalid or not provided, we simply ignore the error
  }
};
