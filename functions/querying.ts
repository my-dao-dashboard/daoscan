import "reflect-metadata";

import { Container } from "typedi";
import { GraphqlController } from "../lib/querying/graphql.controller";

const graphqlController = Container.get(GraphqlController);

export const graphql = graphqlController.handler;
