import { Shares } from "./shares";
import { OrganisationService } from "./organisation.service";
import { Memoize } from "typescript-memoize";
import { Token } from "./token";
import { PLATFORM } from "./platform";
import { DateTime } from "luxon";

interface Props {
  address: string;
  platform: PLATFORM;
  name: string;
  id: bigint;
  createdAt: DateTime;
}

export class Organisation {
  readonly address = this.props.address;
  readonly platform = this.props.platform;
  readonly name = this.props.name;
  readonly id = this.props.id;

  constructor(private readonly props: Props, private readonly service: OrganisationService) {}

  @Memoize()
  get createdAt(): string {
    return this.props.createdAt.toISO();
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

  @Memoize()
  async applications() {
    return this.service.applications(this);
  }
}
