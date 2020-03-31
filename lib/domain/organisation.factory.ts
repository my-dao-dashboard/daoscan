import { Inject, Service } from "typedi";
import { Organisation } from "./organisation";
import { OrganisationService } from "./organisation.service";
import { OrganisationRecord } from "../storage/organisation.record";

@Service(OrganisationFactory.name)
export class OrganisationFactory {
  constructor(@Inject(OrganisationService.name) private readonly organisationService: OrganisationService) {}

  fromRecord(record: OrganisationRecord) {
    return new Organisation(record, this.organisationService);
  }
}
