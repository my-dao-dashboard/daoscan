import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Organisation {
  @Field(type => String)
  address!: string;
}
