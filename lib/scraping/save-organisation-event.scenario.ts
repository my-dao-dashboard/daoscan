import { Scenario } from "../shared/scenario.interface";
import { ORGANISATION_EVENT, OrganisationEvent } from "../shared/organisation-events";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { Service } from "typedi";

@Service(SaveOrganisationEventScenario.name)
export class SaveOrganisationEventScenario implements Scenario<OrganisationEvent, void> {
  constructor() {}

  async execute(event: OrganisationEvent): Promise<void> {
    switch (event.kind) {
      case ORGANISATION_EVENT.APP_INSTALLED:
        // return this.saveAppInstalledEvent.execute(event);
        console.log(`Do nothing with ${event}`);
        return;
      case ORGANISATION_EVENT.CREATED:
        // return
        console.log(`Do nothing with ${event}`);
        return;
      case ORGANISATION_EVENT.ADD_PARTICIPANT:
        // return this.handleAddParticipant(event);
        console.log(`Do nothing with ${event}`);
        return;
      case ORGANISATION_EVENT.TRANSFER_SHARE:
        // return this.handleTransferShare(event);
        console.log(`Do nothing with ${event}`);
        return;
      default:
        throw new UnreachableCaseError(event);
    }
  }
}
