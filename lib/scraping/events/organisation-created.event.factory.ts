import {Service} from "typedi";
import {OrganisationCreatedEvent, OrganisationCreatedEventProps} from "./organisation-created.event";

@Service()
export class OrganisationCreatedEventFactory {
  constructor() {
  }

  fromProps(props: OrganisationCreatedEventProps): OrganisationCreatedEvent {
    return new OrganisationCreatedEvent(props)
  }
}
