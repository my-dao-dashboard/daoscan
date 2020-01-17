export interface BlockProps {
  id: number;
  hash: string;
}

export class Block {
  constructor(private readonly props: BlockProps) {}

  get id(): number {
    return this.props.id;
  }

  get hash(): string {
    return this.props.hash;
  }

  toJSON() {
    return this.props;
  }
}
