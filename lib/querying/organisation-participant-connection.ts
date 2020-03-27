import { Organisation } from "../domain/organisation";
import { MembershipRepository } from "../storage/membership.repository";
import { Participant } from "../domain/participant";
import { Mutex } from "await-semaphore";
import { IEdge } from "./edge.interface";
import { IPagination } from "./pagination.interface";

const DEFAULT_PAGE_SIZE = 25;

function cursorToParticipantAddress(cursor: string) {
  return Buffer.from(cursor, "base64").toString();
}

function participantToCursor(participant: Participant) {
  return Buffer.from(participant.address).toString("base64");
}

export class OrganisationParticipantConnection {
  readonly first: number;
  readonly after: string | undefined;
  private _edges: IEdge<Participant>[] | undefined;
  private edgesMutex = new Mutex();

  constructor(
    readonly organisation: Organisation,
    page: IPagination | undefined,
    private readonly membershipRepository: MembershipRepository
  ) {
    this.first = page?.first || DEFAULT_PAGE_SIZE;
    this.after = page?.after ? cursorToParticipantAddress(page.after) : undefined;
  }

  totalCount(): Promise<number> {
    return this.membershipRepository.countByOrganisationAddress(this.organisation.address);
  }

  async edges(): Promise<IEdge<Participant>[]> {
    return this.edgesMutex.use(async () => {
      if (this._edges) {
        return this._edges;
      } else {
        const addresses = await this.membershipRepository.allByOrganisationAddress(
          this.organisation.address,
          this.first,
          this.after
        );
        this._edges = addresses.map(address => {
          const participant = new Participant(address, this.organisation);
          return {
            node: participant,
            cursor: participantToCursor(participant)
          };
        });
        return this._edges;
      }
    });
  }

  async pageInfo() {
    const edges = await this.edges();
    const lastEdge = edges[edges.length - 1];
    const endCursor = lastEdge ? lastEdge.cursor : null;
    if (endCursor) {
      const nextCount = await this.membershipRepository.hasMoreByOrganisationAddress(
        this.organisation.address,
        lastEdge.node.address
      );
      return {
        endCursor: endCursor,
        hasNextPage: nextCount > 0
      };
    } else {
      return {
        endCursor: null,
        hasNextPage: false
      };
    }
  }
}
