import { EnvService } from "../services/env.service";
import { ENV } from "../shared/env";
import { DynamoService } from "./dynamo.service";
import { ParticipantsRepository } from "./participants.repository";
import faker from "faker";

const PARTICIPANTS_TABLE = "PARTICIPANTS_TABLE";
const PARTICIPANTS_INDEX = "PARTICIPANTS_INDEX";

const env: EnvService = {
  readString: jest.fn((env: ENV) => env.toString())
};

test("save", async () => {
  const dynamo = ({
    put: jest.fn()
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const entity = {
    organisationAddress: faker.random.alphaNumeric(10),
    participantAddress: faker.random.alphaNumeric(10),
    updatedAt: faker.random.number()
  };
  await repository.save(entity);
  expect(dynamo.put).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    Item: {
      organisationAddress: entity.organisationAddress.toLowerCase(),
      participantAddress: entity.participantAddress.toLowerCase(),
      updatedAt: entity.updatedAt
    }
  });
});

test("allOrganisations found", async () => {
  const entity = {
    organisationAddress: faker.random.alphaNumeric(10),
    participantAddress: faker.random.alphaNumeric(10),
    updatedAt: faker.random.number()
  };
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: [entity]
      };
    })
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const participantAddress = entity.participantAddress;
  const result = await repository.allOrganisations(participantAddress);
  expect(dynamo.query).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    IndexName: PARTICIPANTS_INDEX,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "participantAddress = :participantAddress",
    ExpressionAttributeValues: {
      ":participantAddress": participantAddress
    }
  });
  expect(result).toEqual([entity]);
});

test("allOrganisations not found", async () => {
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: []
      };
    })
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const participantAddress = faker.random.alphaNumeric(10);
  const result = await repository.allOrganisations(participantAddress);
  expect(dynamo.query).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    IndexName: PARTICIPANTS_INDEX,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "participantAddress = :participantAddress",
    ExpressionAttributeValues: {
      ":participantAddress": participantAddress
    }
  });
  expect(result).toEqual([]);
});

test("byAddressInOrganisation found", async () => {
  const entity = {
    organisationAddress: faker.random.alphaNumeric(10),
    participantAddress: faker.random.alphaNumeric(10),
    updatedAt: faker.random.number()
  };
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: [entity]
      };
    })
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const participantAddress = entity.participantAddress;
  const organisationAddress = entity.organisationAddress;
  const result = await repository.byAddressInOrganisation(organisationAddress, participantAddress);
  expect(dynamo.query).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "organisationAddress = :organisationAddress AND participantAddress = :participantAddress",
    ExpressionAttributeValues: {
      ":organisationAddress": organisationAddress.toLowerCase(),
      ":participantAddress": participantAddress.toLowerCase()
    },
    Limit: 1
  });
  expect(result).toEqual(entity);
});

test("byAddressInOrganisation not found", async () => {
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: null
      };
    })
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const participantAddress = faker.random.alphaNumeric(10);
  const organisationAddress = faker.random.alphaNumeric(10);
  const result = await repository.byAddressInOrganisation(organisationAddress, participantAddress);
  expect(dynamo.query).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "organisationAddress = :organisationAddress AND participantAddress = :participantAddress",
    ExpressionAttributeValues: {
      ":organisationAddress": organisationAddress.toLowerCase(),
      ":participantAddress": participantAddress.toLowerCase()
    },
    Limit: 1
  });
  expect(result).toEqual(undefined);
});

test("allByOrganisationAddress found", async () => {
  const entity = {
    organisationAddress: faker.random.alphaNumeric(10),
    participantAddress: faker.random.alphaNumeric(10),
    updatedAt: faker.random.number()
  };
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: [entity]
      };
    })
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const organisationAddress = entity.organisationAddress;
  const result = await repository.allByOrganisationAddress(organisationAddress);
  expect(dynamo.query).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "organisationAddress = :organisationAddress",
    ExpressionAttributeValues: {
      ":organisationAddress": organisationAddress.toLowerCase()
    }
  });
  expect(result).toEqual([entity])
});

test("allByOrganisationAddress not found", async () => {
  const dynamo = ({
    query: jest.fn(() => {
      return {
        Items: null
      };
    })
  } as unknown) as DynamoService;
  const repository = new ParticipantsRepository(dynamo, env);
  const organisationAddress = faker.random.alphaNumeric(10)
  const result = await repository.allByOrganisationAddress(organisationAddress);
  expect(dynamo.query).toBeCalledWith({
    TableName: PARTICIPANTS_TABLE,
    ProjectionExpression: "organisationAddress, participantAddress, updatedAt",
    KeyConditionExpression: "organisationAddress = :organisationAddress",
    ExpressionAttributeValues: {
      ":organisationAddress": organisationAddress.toLowerCase()
    }
  });
  expect(result).toEqual([])
});
