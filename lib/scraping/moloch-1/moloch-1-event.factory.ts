import { Inject, Service } from "typedi";
import { Block } from "../block";
import { ScrapingEvent } from "../events/scraping-event";
import { LogEvent, logEvents } from "../events-from-logs";
import {
  SUBMIT_PROPOSAL_BLOCKCHAIN_EVENT,
  SUBMIT_VOTE_BLOCKCHAIN_EVENT,
  SUMMON_COMPLETE_BLOCKCHAIN_EVENT,
  SummonCompleteParams
} from "./moloch-1.blockchain-events";
import { PLATFORM } from "../../domain/platform";
import { EthereumService } from "../../services/ethereum.service";
import { OrganisationCreatedEvent } from "../events/organisation-created.event";
import { ConnectionFactory } from "../../storage/connection.factory";
import { EventRepository } from "../../storage/event.repository";
import { OrganisationRepository } from "../../storage/organisation.repository";
import { AppInstalledEvent, AppInstalledEventProps } from "../events/app-installed.event";
import { APP_ID } from "../../storage/app-id";
import { ApplicationRepository } from "../../storage/application.repository";
import { MOLOCH_1_ABI } from "./moloch-1.abi";
import { ShareTransferEvent, ShareTransferEventProps } from "../events/share-transfer.event";
import { ZERO_ADDRESS } from "../../shared/zero-address";
import { MembershipRepository } from "../../storage/membership.repository";
import { AddDelegateEvent, AddDelegateEventProps } from "../events/add-delegate.event";
import { DelegateRepository } from "../../storage/delegate.repository";
import { MOLOCH_NAMES } from "./moloch-names";
import { HistoryRepository } from "../../storage/history.repository";
import { SubmitProposalEvent } from "../events/submit-proposal.event";
import { SubmitVoteEvent } from "../events/submit-vote.event";
import { VOTE_DECISION } from "../../domain/vote-decision";

async function organisationName(address: string): Promise<string> {
  const found = MOLOCH_NAMES.get(address);
  if (found) {
    return found;
  } else {
    return address;
  }
}

function parseDetails(details: any) {
  try {
    return JSON.parse(details);
  } catch {
    return details;
  }
}

@Service(Moloch1EventFactory.name)
export class Moloch1EventFactory {
  constructor(
    @Inject(EthereumService.name) private readonly ethereum: EthereumService,
    @Inject(ConnectionFactory.name) private readonly connectionFactory: ConnectionFactory,
    @Inject(EventRepository.name) private readonly eventRepository: EventRepository,
    @Inject(OrganisationRepository.name) private readonly organisationRepository: OrganisationRepository,
    @Inject(ApplicationRepository.name) private readonly applicationRepository: ApplicationRepository,
    @Inject(MembershipRepository.name) private readonly membershipRepository: MembershipRepository,
    @Inject(DelegateRepository.name) private readonly delegateRepository: DelegateRepository,
    @Inject(HistoryRepository.name) private readonly historyRepository: HistoryRepository
  ) {}

  async fromBlock(block: Block): Promise<ScrapingEvent[]> {
    const organisationCreatedEvents = await this.organisationCreatedAsSummonComplete(block);
    const appInstalledEvents = await this.appInstalledEvents(organisationCreatedEvents);
    const summonerShareTransfer = await this.summonerShareTransfer(block);
    const summonerDelegate = await this.summonerDelegate(block);
    const proposalEvents = await this.submitProposal(block);
    const votes = await this.submitVote(block);
    let result = new Array<ScrapingEvent>();
    return result
      .concat(organisationCreatedEvents)
      .concat(appInstalledEvents)
      .concat(summonerShareTransfer)
      .concat(summonerDelegate)
      .concat(proposalEvents)
      .concat(votes);
  }

  async summonerDelegate(block: Block): Promise<AddDelegateEvent[]> {
    const events = await this.summonCompleteBlockchainEvents(block);
    const timestamp = await block.timestampDate();
    return events.map(e => {
      const props: AddDelegateEventProps = {
        platform: PLATFORM.MOLOCH_1,
        address: e.summoner.toLowerCase(),
        delegateFor: e.summoner.toLowerCase(),
        organisationAddress: e.address.toLowerCase(),
        blockHash: block.hash,
        blockNumber: e.blockNumber,
        txid: e.txid,
        logIndex: e.logIndex,
        timestamp: timestamp
      };
      return new AddDelegateEvent(props, this.connectionFactory, this.eventRepository, this.historyRepository);
    });
  }

  async summonerShareTransfer(block: Block): Promise<ShareTransferEvent[]> {
    const timestamp = await block.timestamp();
    const events = await this.summonCompleteBlockchainEvents(block);
    return events.map(e => {
      const props: ShareTransferEventProps = {
        platform: PLATFORM.MOLOCH_1,
        organisationAddress: e.address.toLowerCase(),
        blockHash: block.hash,
        blockNumber: e.blockNumber,
        txid: e.txid.toLowerCase(),
        logIndex: e.logIndex,
        shareAddress: e.address.toLowerCase(),
        from: ZERO_ADDRESS,
        to: e.summoner.toLowerCase(),
        amount: "1",
        timestamp: timestamp
      };
      return new ShareTransferEvent(
        props,
        this.eventRepository,
        this.membershipRepository,
        this.connectionFactory,
        this.historyRepository
      );
    });
  }

  async appInstalledEvents(organisationCreatedEvents: OrganisationCreatedEvent[]): Promise<AppInstalledEvent[]> {
    const shares = await this.sharesInstalled(organisationCreatedEvents);
    const banks = await this.guildBankInstalled(organisationCreatedEvents);
    return shares.concat(banks);
  }

  async guildBankInstalled(organisationCreatedEvents: OrganisationCreatedEvent[]): Promise<AppInstalledEvent[]> {
    const banksPromised = organisationCreatedEvents.map(async event => {
      const molochContract = this.ethereum.contract(MOLOCH_1_ABI, event.address);
      const guildBankAddress = await molochContract.methods.guildBank().call();
      const props: AppInstalledEventProps = {
        platform: PLATFORM.MOLOCH_1,
        organisationAddress: event.address.toLowerCase(),
        proxyAddress: guildBankAddress.toLowerCase(),
        appId: APP_ID.MOLOCH_1_BANK,
        txid: event.txid,
        blockNumber: Number(event.blockNumber),
        blockHash: event.blockHash,
        timestamp: event.timestamp
      };
      return new AppInstalledEvent(
        props,
        this.eventRepository,
        this.applicationRepository,
        this.historyRepository,
        this.connectionFactory
      );
    });
    return Promise.all(banksPromised);
  }

  async sharesInstalled(organisationCreatedEvents: OrganisationCreatedEvent[]): Promise<AppInstalledEvent[]> {
    return organisationCreatedEvents.map(event => {
      const props: AppInstalledEventProps = {
        platform: PLATFORM.MOLOCH_1,
        organisationAddress: event.address.toLowerCase(),
        proxyAddress: event.address.toLowerCase(),
        appId: APP_ID.SHARE,
        txid: event.txid,
        blockNumber: Number(event.blockNumber),
        blockHash: event.blockHash,
        timestamp: event.timestamp
      };
      return new AppInstalledEvent(
        props,
        this.eventRepository,
        this.applicationRepository,
        this.historyRepository,
        this.connectionFactory
      );
    });
  }

  async organisationCreatedAsSummonComplete(block: Block): Promise<OrganisationCreatedEvent[]> {
    const timestamp = await block.timestamp();
    const events = await this.summonCompleteBlockchainEvents(block);
    const promised = events.map(async e => {
      const organisationAddress = e.address.toLowerCase();
      const name = await organisationName(organisationAddress);
      const props = {
        platform: PLATFORM.MOLOCH_1,
        name: name,
        address: organisationAddress.toLowerCase(),
        txid: e.txid,
        blockNumber: Number(e.blockNumber),
        blockHash: block.hash,
        timestamp: Number(timestamp)
      };
      return new OrganisationCreatedEvent(
        props,
        this.eventRepository,
        this.organisationRepository,
        this.historyRepository,
        this.connectionFactory
      );
    });
    return Promise.all(promised);
  }

  private async summonCompleteBlockchainEvents(block: Block): Promise<LogEvent<SummonCompleteParams>[]> {
    const extendedBlock = await block.extendedBlock();
    const events = logEvents(this.ethereum.codec, extendedBlock, SUMMON_COMPLETE_BLOCKCHAIN_EVENT);
    const filtered = await Promise.all(
      events.map(async e => {
        const address = e.address;
        const molochContract = this.ethereum.contract(MOLOCH_1_ABI, address);
        try {
          // Check if really Moloch contract
          await molochContract.methods.periodDuration.call();
          await molochContract.methods.votingPeriodLength.call();
          await molochContract.methods.gracePeriodLength.call();
          await molochContract.methods.summoningTime.call();
          return true;
        } catch (e) {
          return false;
        }
      })
    );
    return events.filter((e, i) => filtered[i]);
  }

  async submitProposal(block: Block): Promise<SubmitProposalEvent[]> {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, SUBMIT_PROPOSAL_BLOCKCHAIN_EVENT).map(e => {
      const receipt = e.receipt;
      const abi = [
        { name: "applicant", type: "address" },
        { name: "tokenTribute", type: "uint256" },
        { name: "sharesRequested", type: "uint256" },
        { name: "details", type: "string" }
      ];
      const parameters = this.ethereum.codec.decodeParameters(abi, "0x" + receipt.input.slice(10));
      return new SubmitProposalEvent(
        {
          index: Number(e.proposalIndex),
          proposer: e.memberAddress,
          timestamp: timestamp,
          txid: e.txid,
          blockNumber: e.blockNumber,
          organisationAddress: e.address,
          blockHash: block.hash,
          platform: PLATFORM.MOLOCH_1,
          payload: {
            applicant: e.applicant.toLowerCase(),
            description: parseDetails(parameters.details),
            sharesRequested: e.sharesRequested,
            tribute: e.tokenTribute
          }
        },
        this.connectionFactory,
        this.eventRepository,
        this.historyRepository
      );
    });
  }

  async submitVote(block: Block) {
    const extendedBlock = await block.extendedBlock();
    const timestamp = await block.timestamp();
    return logEvents(this.ethereum.codec, extendedBlock, SUBMIT_VOTE_BLOCKCHAIN_EVENT).map(e => {
      const receipt = e.receipt;
      return new SubmitVoteEvent(
        {
          platform: PLATFORM.MOLOCH_1,
          blockHash: receipt.blockHash,
          blockNumber: receipt.blockNumber,
          organisationAddress: e.address,
          proposalIndex: Number(e.proposalIndex),
          timestamp: timestamp,
          txid: receipt.transactionHash,
          voter: e.memberAddress,
          decision: VOTE_DECISION.fromNumber(Number(e.uintVote))
        },
        this.connectionFactory,
        this.eventRepository,
        this.historyRepository
      );
    });
  }
}
