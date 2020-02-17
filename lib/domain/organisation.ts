import { Organisation as OrganisationRow } from "../storage/organisation.row";
import { Shares } from "./shares";
import { IToken } from "./token.interface";
import { OrganisationService } from "./organisation.service";
import { Participant } from "./participant";

export class Organisation {
  readonly address = this.row.address;
  readonly platform = this.row.platform;
  readonly name = this.row.name;

  constructor(private readonly row: OrganisationRow, private readonly service: OrganisationService) {}

  shares(): Promise<Shares | undefined> {
    return this.service.shares(this.platform, this.address, this.name);
  }

  async bank(): Promise<IToken[]> {
    return this.service.bank(this.platform, this.address);
  }

  async participant(participantAddress: string) {
    return this.service.participant(this, participantAddress);
  }

  async participants(): Promise<Participant[]> {
    return this.service.participants(this);
  }
}
