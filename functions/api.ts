import "reflect-metadata";

import { Container } from "typedi";
import { httpHandler } from "../lib/shared/http-handler";
import { OrganisationsController } from "../lib/api/organisations.controller";
import { GraphqlController } from "../lib/api/graphql.controller";

const controller = Container.get(OrganisationsController);
export const readParticipants = httpHandler(controller.participants);
export const readOrganisations = httpHandler(controller.byParticipant);
export const allOrgs = httpHandler(controller.index);

export const graphql = Container.get(GraphqlController).handler;
