import { DynamoService } from "./storage/dynamo.service";
import { ParticipantsRepository } from "./storage/participants.repository";
import { OrganisationsRepository } from "./storage/organisations.repository";
import { ApiController } from "./api.controller";

export class ApiContainer {
  public readonly dynamo = new DynamoService();
  public readonly participantsRepository = new ParticipantsRepository(this.dynamo);
  public readonly organisationsRepository = new OrganisationsRepository(this.dynamo);
  public readonly apiController = new ApiController(this.organisationsRepository);
}
