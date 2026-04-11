import { FastifyInstance } from "fastify";
import z from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

interface FastifyValidationError {
  message: string;
  instancePath?: string;
  keyword?: string;
  params?: Record<string, unknown>;
}

interface CustomError extends Error {
  code?: string;
  validation?: FastifyValidationError[];
  issues?: z.core.$ZodIssue[];
}

export const errorHandler: FastifyErrorHandler = (rawError, request, reply) => {
  const error = rawError as CustomError;
  // --- VALIDAÇÕES DO ZOD / FASTIFY ---
  if (error.code === "FST_ERR_VALIDATION" || error.name === "ZodError") {
    const message = error.validation
      ? error.validation[0]?.message
      : error.issues?.[0]?.message || "Validation error";

    return reply.status(400).send({
      message: message,
      code: "BAD_REQUEST",
    });
  }

  // --- 404 NOT FOUND (Recursos não encontrados) ---

  if (error.name === "UserNotFoundError") {
    return reply.status(404).send({
      message: error.message,
      code: "USER_NOT_FOUND",
    });
  }

  if (error.name === "EventNotFoundError") {
    return reply.status(404).send({
      message: error.message,
      code: "EVENT_NOT_FOUND",
    });
  }

  if (error.name === "AddressNotFoundError") {
    return reply.status(404).send({
      message: error.message,
      code: "ADDRESS_NOT_FOUND",
    });
  }

  if (error.name === "CoordinatesNotFoundError") {
    return reply.status(404).send({
      message: error.message,
      code: "COORDINATES_NOT_FOUND",
    });
  }

  // --- 401 & 403 UNAUTHORIZED / FORBIDDEN (Problemas de Permissão/Acesso) ---

  if (error.name === "LoginError") {
    return reply.status(401).send({
      message: error.message,
      code: "INVALID_LOGIN",
    });
  }

  if (error.name === "RefreshTokenError") {
    return reply.status(401).send({
      message: error.message,
      code: "INVALID_REFRESH_TOKEN",
    });
  }

  if (error.name === "AccessCodeIsRequiredError") {
    return reply.status(401).send({
      message: error.message,
      code: "ACCESS_CODE_REQUIRED",
    });
  }

  if (error.name === "EventNotAuthorizedError") {
    return reply.status(403).send({
      message: error.message,
      code: "EVENT_NOT_AUTHORIZED",
    });
  }

  if (error.name === "OrganizerCannotReviewOwnEventError") {
    return reply.status(403).send({
      message: error.message,
      code: "ORGANIZER_CANNOT_REVIEW_OWN_EVENT",
    });
  }

  if (error.name === "InvalidTokenError") {
    return reply.status(403).send({
      message: error.message,
      code: "INVALID_TOKEN",
    });
  }

  // --- 409 CONFLICT (Conflitos de estado/Duplicidade) ---

  if (error.name === "EmailAlreadyExistsError") {
    return reply.status(409).send({
      message: error.message,
      code: "EMAIL_ALREADY_EXISTS",
    });
  }

  if (error.name === "UserAlreadySubscribedError") {
    return reply.status(409).send({
      message: error.message,
      code: "USER_ALREADY_SUBSCRIBED",
    });
  }

  if (error.name === "UserAlreadyReviewedError") {
    return reply.status(409).send({
      message: error.message,
      code: "USER_ALREADY_REVIEWED",
    });
  }

  if (error.name === "EventAlreadyCanceledError") {
    return reply.status(409).send({
      message: error.message,
      code: "EVENT_ALREADY_CANCELED",
    });
  }

  if (error.name === "EventAlreadyReopenedError") {
    return reply.status(409).send({
      message: error.message,
      code: "EVENT_ALREADY_REOPENED",
    });
  }

  // --- 400 BAD REQUEST (Regras de negócio violadas ou requisições ilógicas) ---

  if (error.name === "UserNotSubscribedError") {
    return reply.status(400).send({
      message: error.message,
      code: "USER_NOT_SUBSCRIBED",
    });
  }

  if (error.name === "EvaluationNotDisposibleError") {
    return reply.status(400).send({
      message: error.message,
      code: "EVALUATION_NOT_DISPOSIBLE",
    });
  }

  if (error.name === "CannotCancelPastEventError") {
    return reply.status(400).send({
      message: error.message,
      code: "CANNOT_CANCEL_PAST_EVENT",
    });
  }

  if (error.name === "CannotReopenPastEventError") {
    return reply.status(400).send({
      message: error.message,
      code: "CANNOT_REOPEN_PAST_EVENT",
    });
  }

  if (error.name === "EventNotCanceledError") {
    return reply.status(400).send({
      message: error.message,
      code: "EVENT_NOT_CANCELED",
    });
  }

  if (error.name === "CannotEvaluateCanceledEventError") {
    return reply.status(400).send({
      message: error.message,
      code: "CANNOT_EVALUATE_CANCELED_EVENT",
    });
  }

  if (error.name === "EventNotNeededAccessCodeError") {
    return reply.status(400).send({
      message: error.message,
      code: "EVENT_NOT_NEEDED_ACCESS_CODE",
    });
  }

  // --- 502 BAD GATEWAY (Falhas em integrações externas) ---

  if (error.name === "OSMProviderError") {
    return reply.status(502).send({
      message: error.message,
      code: "OSM_PROVIDER_ERROR",
    });
  }

  // --- 500 INTERNAL SERVER ERROR (Problemas internos do servidor) ---

  // Imprime o erro no console do servidor para podermos debugar!
  console.error("🚨 Erro Crítico Não Mapeado:", error);

  return reply.status(500).send({
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
};
