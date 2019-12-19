import { TokenGraphql } from "./token.graphql";

export interface ParticipantGraphql {
  address: string;
  shares: TokenGraphql;
}
