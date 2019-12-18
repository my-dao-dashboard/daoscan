import { ApiContext, ApiEvent } from "./api.types";
import { KnownError } from "./errors";
import { HTTP_STATUS_CODE } from "./http-status-code";
import { APIGatewayProxyHandler } from "aws-lambda";

export function ok(data?: any, statusCode?: number) {
  const realStatusCode = statusCode || 200;
  const body = data ? JSON.stringify(data) : "";
  return {
    statusCode: realStatusCode,
    body: body
  };
}

export function error(e: Error) {
  if (e instanceof KnownError) {
    return {
      statusCode: e.code,
      body: JSON.stringify({ error: e.description })
    };
  } else {
    return {
      statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ error: e.message })
    };
  }
}

export function handler<R>(f: (event: ApiEvent, context: ApiContext) => Promise<R>): APIGatewayProxyHandler {
  return async (event: ApiEvent, context: ApiContext) => {
    try {
      const result = await f(event, context);
      return ok(result);
    } catch (e) {
      return error(e);
    }
  };
}
