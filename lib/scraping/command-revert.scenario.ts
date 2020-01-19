import { Scenario } from "../shared/scenario";
import { RevertCommand } from "./command";
import { Inject, Service } from "typedi";
import { EventFactory } from "./events/event.factory";

@Service(CommandRevertScenario.name)
export class CommandRevertScenario implements Scenario<RevertCommand, void> {
  constructor(
    @Inject(EventFactory.name) private readonly eventFactory: EventFactory
  ) {}

  async execute(command: RevertCommand): Promise<void> {
    console.log('TODO CommandRevertScenario.execute')
    // const event = this.eventFactory.fromStorage(command);
    // console.log(event);
    // find event
    // recover
    //

    // const event
    // const event = command.event;
    // switch (event.kind) {
    //   case SCRAPING_EVENT_KIND.ORGANISATION_CREATED:
    //     return this.organisationCreated.commit(event);
    //   default:
    //     throw new UnreachableCaseError(event.kind);
    // }
  }
}
