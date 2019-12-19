import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Organisation {
  @Field(type => String)
  address!: string;

  @Field(type => String)
  platform!: string;

  @Field(type => String)
  name!: string;
}
