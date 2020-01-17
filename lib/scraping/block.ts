import _ from "lodash";

export interface BlockProps {
  id: number;
  hash: string;
}

export class Block {
  constructor(protected readonly props: BlockProps) {}

  get id(): number {
    return this.props.id;
  }

  get hash(): string {
    return this.props.hash;
  }

  equals(other: Block): boolean {
    return _.isEqual(this.props, other.props);
  }

  toJSON() {
    return this.props;
  }
}
