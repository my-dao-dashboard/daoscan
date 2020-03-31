import { FindOperator, FindOperatorType, ValueTransformer } from "typeorm";

export const bigintTransformer: ValueTransformer = {
  to: (entityValue: bigint | FindOperator<bigint> | undefined) => {
    if (entityValue instanceof FindOperator) {
      const type = (entityValue as any)._type as FindOperatorType; // Beware, private API
      return new FindOperator(type, entityValue.value, entityValue.useParameter, entityValue.multipleParameters);
    } else {
      return entityValue?.toString();
    }
  },
  from: (databaseValue: string): bigint => BigInt(databaseValue)
};
