import { EthereumService, ExtendedBlock } from "../services/ethereum.service";
import { Scraper } from "./scraper.interface";
import { AragonScraper } from "./aragon.scraper";
import * as _ from "lodash";
import { DynamoService } from "../storage/dynamo.service";
import {
  AddParticipantEvent,
  AppInstalledEvent,
  ORGANISATION_EVENT,
  OrganisationCreatedEvent,
  OrganisationEvent,
  ShareTransferEvent
} from "../shared/organisation-events";
import { BlocksRepository } from "../storage/blocks.repository";
import { BlocksQueue } from "../queues/blocks.queue";
import { bind } from "decko";
import { ScrapingQueue } from "../queues/scraping.queue";
import { TOKEN_ABI, TOKEN_CONTROLLER_ABI } from "./aragon.constants";
import { ApplicationsRepository } from "../storage/applications.repository";
import { NotFoundError } from "../shared/errors";
import { UnreachableCaseError } from "../shared/unreachable-case-error";
import { OrganisationsRepository } from "../storage/organisations.repository";
import { ParticipantsRepository } from "../storage/participants.repository";
import { Service, Inject } from "typedi";
import { PLATFORM } from "../shared/platform";

@Service(ScrapingService.name)
export class ScrapingService {
  private readonly scrapers: Scraper[];

  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(DynamoService.name) private readonly dynamo: DynamoService,
    @Inject(BlocksRepository.name) private readonly blocksRepository: BlocksRepository,
    @Inject(BlocksQueue.name) private readonly blocksQueue: BlocksQueue,
    @Inject(ScrapingQueue.name) private readonly scrapingQueue: ScrapingQueue,
    @Inject(ApplicationsRepository.name) private readonly applicationsRepository: ApplicationsRepository,
    @Inject(OrganisationsRepository.name) private readonly organisationsRepository: OrganisationsRepository,
    @Inject(ParticipantsRepository.name) private readonly participantsRepository: ParticipantsRepository
  ) {
    this.scrapers = [new AragonScraper(this.ethereum.web3, dynamo, this.ethereum)];
  }

  @bind()
  async tickBlock(): Promise<void> {
    const block = await this.ethereum.block("latest");
    const latest = block.number;
    const previous = latest - 20;
    let blockNumbers = [];
    for (let i = previous; i <= latest; i++) blockNumbers.push(i);
    await Promise.all(
      blockNumbers.map(async i => {
        const isPresent = await this.blocksRepository.isPresent(i);
        if (!isPresent) {
          await this.blocksQueue.send(i);
        }
      })
    );
  }

  @bind()
  async parseBlock(eventBody: string): Promise<{ events: OrganisationEvent[] }> {
    const data = JSON.parse(eventBody);
    const id = Number(data.id);
    console.log(`Starting parsing block #${id}...`);
    const events = await this.fromBlock(id);
    await this.scrapingQueue.sendBatch(events);
    await this.blocksRepository.markParsed(id);
    console.log(`Parsed block #${id}: events=${events.length}`);
    return { events };
  }

  async fromBlock(id: number): Promise<OrganisationEvent[]> {
    const block = await this.ethereum.extendedBlock(id);
    const scraped = await Promise.all(this.scrapers.map(scraper => scraper.fromBlock(block)));
    return _.flatten(scraped);
  }

  async parseParticipants(organisationAddress: string): Promise<{ addr: string; participants: string[] }> {
    const tokenControllerAddress = await this.applicationsRepository.tokenControllerAddress(organisationAddress);
    const web3 = this.ethereum.web3;
    if (tokenControllerAddress) {
      const tokenController = new web3.eth.Contract(TOKEN_CONTROLLER_ABI, tokenControllerAddress);
      const tokenAddress = await tokenController.methods.token().call();
      const token = new web3.eth.Contract(TOKEN_ABI, tokenAddress);
      const transferEvents = await token.getPastEvents("Transfer", { fromBlock: 0, toBlock: "latest" });
      const participants = transferEvents.reduce((acc, event) => {
        const from = (event.returnValues._from as string).toLowerCase();
        const to = (event.returnValues._to as string).toLowerCase();
        if (from != "0x0000000000000000000000000000000000000000") {
          acc.add(from);
        }
        if (to != "0x0000000000000000000000000000000000000000") {
          acc.add(to);
        }
        return acc;
      }, new Set<string>());

      const events = Array.from(participants).map<AddParticipantEvent>(participant => {
        return {
          kind: ORGANISATION_EVENT.ADD_PARTICIPANT,
          platform: PLATFORM.ARAGON,
          organisationAddress: organisationAddress,
          participant: participant
        };
      });
      await this.scrapingQueue.sendBatch(events);

      return {
        addr: organisationAddress,
        participants: Array.from(participants)
      };
    } else {
      throw new NotFoundError(`No organisation ${organisationAddress} is found`);
    }
  }

  async readExtendedBlock(id: number): Promise<{ block: ExtendedBlock; events: OrganisationEvent[] }> {
    const block = await this.ethereum.extendedBlock(id);
    const events = await this.fromBlock(id);
    return { block, events };
  }

  async handleInstallApplication(event: AppInstalledEvent): Promise<void> {
    console.log(`Saving application...`, event);
    await this.applicationsRepository.save(event);
    console.log(`Application saved`, event);
  }

  async handleCreateOrganisation(event: OrganisationCreatedEvent): Promise<void> {
    await this.organisationsRepository.save(event);
  }

  async handleAddParticipant(event: AddParticipantEvent) {
    await this.participantsRepository.save({
      organisationAddress: event.organisationAddress,
      participantAddress: event.participant,
      updatedAt: new Date().valueOf()
    });
  }

  async putParticipant(event: ShareTransferEvent, account: string) {
    if (account !== "0x0000000000000000000000000000000000000000") {
      await this.participantsRepository.save({
        organisationAddress: event.organisationAddress,
        participantAddress: account,
        updatedAt: new Date().valueOf()
      });
    }
  }

  async handleTransferShare(event: ShareTransferEvent) {
    await this.putParticipant(event, event.from);
    await this.putParticipant(event, event.to);
  }

  async saveOrganisationEvent(event: OrganisationEvent) {
    switch (event.kind) {
      case ORGANISATION_EVENT.APP_INSTALLED:
        return this.handleInstallApplication(event);
      case ORGANISATION_EVENT.CREATED:
        return this.handleCreateOrganisation(event);
      case ORGANISATION_EVENT.ADD_PARTICIPANT:
        return this.handleAddParticipant(event);
      case ORGANISATION_EVENT.TRANSFER_SHARE:
        return this.handleTransferShare(event);
      default:
        throw new UnreachableCaseError(event);
    }
  }
}
