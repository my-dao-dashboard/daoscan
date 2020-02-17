import { ApolloServer } from "apollo-server-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Inject, Service } from "typedi";
import fs from "fs";
import path from "path";
import { makeExecutableSchema } from "graphql-tools";
import { AccountPresentation } from "./account.presentation";
import { AccountResolver } from "./account.resolver";
import { OrganisationResolver } from "./organisation.resolver";
import { GlobalStatsResolver } from "./global-stats.resolver";
import { ParticipantResolver } from "./participant.resolver";
import { ProposalResolver } from "./proposal.resolver";

@Service(GraphqlController.name)
export class GraphqlController {
  public readonly handler: APIGatewayProxyHandler;

  constructor(
    @Inject(AccountResolver.name) private readonly accountResolver: AccountResolver,
    @Inject(OrganisationResolver.name) private readonly organisationResolver: OrganisationResolver,
    @Inject(GlobalStatsResolver.name) private readonly globalStatsResolver: GlobalStatsResolver,
    @Inject(ParticipantResolver.name) private readonly participantResolver: ParticipantResolver,
    @Inject(ProposalResolver.name) private readonly proposalResolver: ProposalResolver
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
    this.handler = server.createHandler({
      cors: {
        origin: "*",
        credentials: true
      }
    });
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
        },
        stats: this.globalStatsResolver.globalStats
      },
      Organisation: {
        totalSupply: this.organisationResolver.totalSupply,
        bank: this.organisationResolver.bank,
        shareValue: this.organisationResolver.shareValue,
        participants: this.organisationResolver.participants,
        participant: this.organisationResolver.participant,
        proposals: this.organisationResolver.proposals,
        proposal: this.organisationResolver.proposal
      },
      Participant: {
        shares: this.participantResolver.shares
      },
      Account: {
        organisations: this.accountResolver.organisations
      },
      Proposal: {
        votes: this.proposalResolver.votes
      }
    };
  }
}
