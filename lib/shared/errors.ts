import { HTTP_STATUS_CODE } from "./http-status-code";

export abstract class KnownError extends Error {
  protected constructor(public code: HTTP_STATUS_CODE, public description: string) {
    super(description);
  }
}

export class BadRequestError extends KnownError {
  constructor(public description: string) {
    super(HTTP_STATUS_CODE.BAD_REQUEST, description);
  }
}

export class ConfigurationError extends KnownError {
  constructor(public description: string) {
    super(HTTP_STATUS_CODE.CONFIGURATION_ERROR, description);
  }
}

export class ForbiddenError extends KnownError {
  constructor(public description: string) {
    super(HTTP_STATUS_CODE.FORBIDDEN, description);
  }
}

export class InternalServerError extends KnownError {
  constructor(public description: string) {
    super(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, description);
  }
}

export class NotFoundError extends KnownError {
  constructor(public description: string) {
    super(HTTP_STATUS_CODE.NOT_FOUND, description);
  }
}

export class InvalidCaseError extends InternalServerError {}

export class NotImplementedError extends InternalServerError {}
