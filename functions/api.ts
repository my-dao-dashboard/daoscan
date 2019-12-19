import "reflect-metadata";

import { Container } from "typedi";
import { handler } from "../lib/shared/handler";
import { OrganisationsController } from "../lib/api/organisations.controller";
import { GraphqlController } from "../lib/api/graphql.controller";

const controller = Container.get(OrganisationsController);
export const readParticipants = handler(controller.participants);
export const readOrganisations = handler(controller.byParticipant);
export const allOrgs = handler(controller.index);

export const graphql = Container.get(GraphqlController).handler;
