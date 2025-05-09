import { Max, ValidationOptions } from 'class-validator';

export function MaxSafeInteger(validationOptions?: ValidationOptions) {
  return Max(Number.MAX_SAFE_INTEGER, validationOptions);
}
