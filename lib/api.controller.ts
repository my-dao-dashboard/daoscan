import { OrganisationEntity, OrganisationsRepository } from "./storage/organisations.repository";

export class ApiController {
  constructor(private readonly organisationsRepository: OrganisationsRepository) {}

  async getOrganisations(): Promise<{ count: number; items: OrganisationEntity[] }> {
    const items = await this.organisationsRepository.all();
    const count = items.length;

    return {
      count,
      items
    };
  }
}
