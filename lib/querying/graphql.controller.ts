import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Inject, Service } from "typedi";
import fs from "fs";
import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { AccountPresentation } from "./account.presentation";
import { EthereumService } from "../services/ethereum.service";
import { AccountResolver } from "./account.resolver";
import { OrganisationResolver } from "./organisation.resolver";
// import { AccountResolver } from "./account.resolver";
// import { OrganisationResolver } from "./organisation.resolver";
// import { ParticipantResolver } from "./participant.resolver";
// import { AccountResolver } from "./account.resolver";

// @Inject(OrganisationResolver.name) private readonly organisationResolver: OrganisationResolver,
// @Inject(ParticipantResolver.name) private readonly participantResolver: ParticipantResolver,

@Service(GraphqlController.name)
export class GraphqlController {
  public readonly handler: APIGatewayProxyHandler;

  constructor(
    @Inject(AccountResolver.name) private readonly accountResolver: AccountResolver,
    @Inject(OrganisationResolver.name) private readonly organisationResolver: OrganisationResolver
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
      playground: true
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
        account: (root: undefined, args: { address: string }) => {
          return new AccountPresentation(args.address);
        },
        organisation: (root: undefined, args: { address: string }) => {
          return this.organisationResolver.organisation(args.address);
        }
      },
      Organisation: {
        //   participants: this.organisationResolver.participants,
        //   participant: this.organisationResolver.participant,
        //   totalSupply: this.organisationResolver.totalSupply,
        //   shareValue: this.organisationResolver.shareValue,
        //   bank: this.organisationResolver.bank
      },
      Account: {
        organisations: this.accountResolver.organisations
      }
    };
  }
}
