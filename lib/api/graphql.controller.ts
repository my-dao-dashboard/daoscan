import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Inject, Service } from "typedi";
import fs from "fs";
import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { OrganisationsResolver } from "./organisation.resolver";
import { ParticipantResolver } from "./participant.resolver";

@Service()
export class GraphqlController {
  public readonly handler: APIGatewayProxyHandler;

  constructor(
    @Inject(type => OrganisationsResolver) private readonly organisationsResolver: OrganisationsResolver,
    @Inject(type => ParticipantResolver) private readonly participantResolver: ParticipantResolver
  ) {
    const server = new ApolloServer({
      schema: this.schema(),
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

  private schema() {
    const typeDefs = fs.readFileSync(path.resolve(__dirname, "../../data/schema.graphql")).toString();
    return makeExecutableSchema({
      typeDefs: typeDefs,
      resolvers: this.resolvers()
    });
  }

  private resolvers() {
    return {
      Query: {
        account: (address: string) => {
          return {
            address: address
          };
        },
        organisation: (root: any, args: { address: string }) => {
          return this.organisationsResolver.organisation(args.address);
        }
      },
      Organisation: {
        participants: this.organisationsResolver.participants,
        participant: this.organisationsResolver.participant,
        totalSupply: this.organisationsResolver.totalSupply,
        shareValue: this.organisationsResolver.shareValue,
        bank: this.organisationsResolver.bank
      }
    };
  }
}
