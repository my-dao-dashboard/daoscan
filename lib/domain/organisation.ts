import { Organisation as OrganisationRow } from "../storage/organisation.row";
import { Shares } from "./shares";
import { OrganisationService } from "./organisation.service";
import { Memoize } from "typescript-memoize";
import { Token } from "./token";

export class Organisation {
  readonly address = this.row.address;
  readonly platform = this.row.platform;
  readonly name = this.row.name;
  readonly id = this.row.id;

  constructor(private readonly row: OrganisationRow, private readonly service: OrganisationService) {}

  @Memoize()
  get createdAt(): string {
    return this.row.createdAt.toISO();
  }

  @Memoize()
  shares(): Promise<Shares | undefined> {
    return this.service.shares(this.platform, this.address, this.name);
  }

  @Memoize()
  async bank(): Promise<Token[]> {
    return this.service.bank(this.platform, this.address);
  }

  async participant(participantAddress: string) {
    return this.service.participant(this, participantAddress);
  }
}
