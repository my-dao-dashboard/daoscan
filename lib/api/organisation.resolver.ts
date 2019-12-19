import { Arg, Query, Resolver } from "type-graphql";
import { Organisation } from "./organisation.graphql";
import { OrganisationsRepository } from "../storage/organisations.repository";

@Resolver()
export class OrganisationsResolver {
  private organisationsCollection: Organisation[] = [];

  constructor(private readonly organisationsRepository: OrganisationsRepository) {}

  @Query(returns => Organisation)
  async organisation(@Arg("address") address: string) {
    return this.organisationsRepository.byAddress(address);
  }

  @Query(returns => [Organisation])
  async organisations() {
    return [];
  }
}
