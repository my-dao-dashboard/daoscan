import { APIGatewayEvent, Context } from "aws-lambda";
import { KnownError } from "./errors";
import { HTTP_STATUS_CODE } from "./http-status-code";
import { APIGatewayProxyHandler } from "aws-lambda";

export function isHttp(event: any): event is APIGatewayEvent {
  return !!event.httpMethod && !!event.path;
}

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

export function httpHandler<R>(f: (event: APIGatewayEvent, context: Context) => Promise<R>): APIGatewayProxyHandler {
  return async (event: APIGatewayEvent, context: Context) => {
    try {
      const result = await f(event, context);
      return ok(result);
    } catch (e) {
      console.error(e);
      return error(e);
    }
  };
}
