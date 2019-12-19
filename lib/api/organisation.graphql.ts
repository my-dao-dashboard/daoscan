export interface OrganisationGraphql {
  address: string;
  platform: string;
  name: string;
  // shares: Token
  // bank: [Token]
  // participant(address: String!): Participant
  // participants: [Participant]
  txid: string;
  timestamp: number;
  blockNumber: number;
}
