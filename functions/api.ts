import "reflect-metadata";

import { ApiContainer } from "../lib/api/api.container";
import { handler } from "../lib/shared/handler";

const container = new ApiContainer();

export const readParticipants = handler(container.organisationsController.participants);
export const readOrganisations = handler(container.organisationsController.byParticipant);
export const allOrgs = handler(container.organisationsController.index);

export const graphql = container.graphql.handler;
