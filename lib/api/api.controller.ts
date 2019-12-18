import { OrganisationEntity, OrganisationsRepository } from "../storage/organisations.repository";
import { bind } from "decko";

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
