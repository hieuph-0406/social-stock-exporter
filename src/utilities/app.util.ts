import { ErrorDetailDto } from '@/common/dto/error-detail.dto';
import { ValidationError } from '@nestjs/common';

export type ObjectType = { [key: string]: any };

export const transformValidateObject = (
  errors: ValidationError[],
): ErrorDetailDto[] => {
  const errorDetails: ErrorDetailDto[] = [];

  function recursiveExtract(error: ValidationError, property: string = null) {
    if (error.constraints) {
      for (const constraint in error.constraints) {
        errorDetails.push({
          property: property ? `${property}.${error.property}` : error.property,
          errorCode: constraint,
          errorMessage: error.constraints[constraint],
        });
      }
    }
    if (error.children) {
      for (const childError of error.children) {
        recursiveExtract(
          childError,
          property ? `${property}.${error.property}` : error.property,
        );
      }
    }
  }

  for (const error of errors) {
    recursiveExtract(error);
  }

  return errorDetails;
};
