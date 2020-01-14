import { OrganisationsRepository } from "../storage/organisations.repository";
import { bind } from "decko";
import { OrganisationEntity } from "../storage/organisation.entity";

export class ApiController {
  constructor(private readonly organisationsRepository: OrganisationsRepository) {}

  @bind()
  async getOrganisations(): Promise<{ count: number; items: OrganisationEntity[] }> {
    const items = await this.organisationsRepository.all();
    const count = items.length;

    return {
      count,
      items
    };
  }
}
