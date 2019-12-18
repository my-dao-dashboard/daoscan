import {APIGatewayEvent, Context, ProxyResult} from "aws-lambda";

export type ApiEvent = APIGatewayEvent;
export type ApiResponse = ProxyResult;
export type ApiContext = Context;
export type ApiHandler<R> = (event: APIGatewayEvent, context: Context) => Promise<R>; // Same as ProxyHandler, but requires callback.


export interface ErrorResponseBody {
  error: ErrorResult;
}

export abstract class ErrorResult extends Error {
  public constructor(public code: string, public description: string) {
    super(description);
  }
}

export class BadRequestResult extends ErrorResult {}

export class ConfigurationErrorResult extends ErrorResult {}

export class ForbiddenResult extends ErrorResult {}

export class InternalServerErrorResult extends ErrorResult {}

export class NotFoundResult extends ErrorResult {}

export enum HttpStatusCode {
  BadRequest = 400,
  ConfigurationError = 512,
  Forbidden = 403,
  InternalServerError = 500,
  NotFound = 404,
  Ok = 200
}
