interface Props {
  readonly id: string | bigint;
  readonly createdAt: string | Date;
}

export class OrganisationConnectionCursor {
  constructor(readonly id: bigint, readonly createdAt: Date) {}

  static build(props: Props) {
    const id = BigInt(props.id);
    const createdAt = new Date(props.createdAt);
    return new OrganisationConnectionCursor(id, createdAt);
  }

  static decode(raw: string): OrganisationConnectionCursor {
    const buffer = Buffer.from(raw, "base64").toString();
    const payload = JSON.parse(buffer);
    return OrganisationConnectionCursor.build(payload);
  }

  encode(): string {
    const payload = {
      id: this.id.toString(),
      createdAt: this.createdAt.toISOString()
    };
    const string = JSON.stringify(payload);
    return Buffer.from(string).toString("base64");
  }
}
