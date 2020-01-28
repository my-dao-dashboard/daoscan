import "reflect-metadata";

import { Container } from "typedi";
import { GraphqlController } from "../lib/querying/graphql.controller";
import { migrateUp } from "../lib/shared/migrate-up";

migrateUp();

const graphqlController = Container.get(GraphqlController);

export const graphql = graphqlController.handler;
