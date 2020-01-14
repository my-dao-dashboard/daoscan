export interface Scenario<Request, Response> {
  execute(request: Request): Promise<Response>;
}
