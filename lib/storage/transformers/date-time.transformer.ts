import { FindOperator, FindOperatorType, ValueTransformer } from "typeorm";
import { DateTime } from "luxon";

export const dateTimeTransformer: ValueTransformer = {
  to: (entityValue: DateTime | FindOperator<DateTime> | undefined) => {
    if (entityValue instanceof FindOperator) {
      const type = (entityValue as any)._type as FindOperatorType; // Beware, private API
      return new FindOperator(
        type,
        entityValue.value.toJSDate(),
        entityValue.useParameter,
        entityValue.multipleParameters
      );
    } else {
      return entityValue?.toJSDate();
    }
  },
  from: (databaseValue: Date): DateTime => DateTime.fromJSDate(databaseValue)
};
