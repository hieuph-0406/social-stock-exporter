import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsBothFieldsPresent(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isBothFieldsPresent',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: `Field ${propertyName} must be present when field ${property} is present`,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            (value && !args.object[property]) ||
            (value && args.object[property]) ||
            (!value && !args.object[property])
          );
        },
      },
    });
  };
}
