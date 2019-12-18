import { DynamoService } from "../storage/dynamo.service";
import { ParticipantsRepository } from "../storage/participants.repository";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { OrganisationsController } from "./organisations.controller";

export class ApiContainer {
  public readonly dynamo = new DynamoService();
  public readonly participantsRepository = new ParticipantsRepository(this.dynamo);
  public readonly organisationsRepository = new OrganisationsRepository(this.dynamo);
  public readonly organisationsController = new OrganisationsController(
    this.organisationsRepository,
    this.participantsRepository
  );
}
