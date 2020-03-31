import { SelectQueryBuilder } from "typeorm";

type Selector<Entry, Cursor> = (
  query: SelectQueryBuilder<Entry>,
  cursor: Cursor,
  include: boolean
) => SelectQueryBuilder<Entry>;

export class ConnectionQuery<Entry, Cursor> {
  constructor(
    readonly query: SelectQueryBuilder<Entry>,
    private readonly _before: Selector<Entry, Cursor>,
    private readonly _after: Selector<Entry, Cursor>
  ) {}

  before(cursor: Cursor, include: boolean): ConnectionQuery<Entry, Cursor> {
    const nextQuery = this._before(this.query, cursor, include);
    return new (this.constructor as any)(nextQuery, this._before);
  }

  after(cursor: Cursor, include: boolean): ConnectionQuery<Entry, Cursor> {
    const nextQuery = this._after(this.query, cursor, include);
    return new (this.constructor as any)(nextQuery, this._before);
  }

  getCount() {
    return this.query.getCount();
  }

  getMany() {
    return this.query.getMany();
  }

  skip(n: number): ConnectionQuery<Entry, Cursor> {
    const next = this.query.clone().skip(n);
    return new (this.constructor as any)(next, this._before);
  }

  take(n: number): ConnectionQuery<Entry, Cursor> {
    const next = this.query.clone().take(n);
    return new (this.constructor as any)(next, this._before);
  }
}
