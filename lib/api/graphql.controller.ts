import { buildSchemaSync } from "type-graphql";
import { OrganisationsResolver } from "./organisation.resolver";
import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Service, Container } from "typedi";

@Service()
export class GraphqlController {
  public readonly handler: APIGatewayProxyHandler;

  constructor() {
    const schema = buildSchemaSync({
      resolvers: [OrganisationsResolver],
      container: Container,
      validate: false
    });
    const server = new ApolloServer({
      schema,
      formatError: error => {
        console.log(error);
        return error;
      },
      context: ({ event, context }) => ({
        headers: event.headers,
        functionName: context.functionName,
        event,
        context
      }),
      playground: true,
      tracing: true
    });
    this.handler = server.createHandler();
  }
}
