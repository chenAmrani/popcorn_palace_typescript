import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidReleaseYear(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isValidReleaseYear',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentYear = new Date().getFullYear();
          return typeof value === 'number' && value <= currentYear;
        },
        defaultMessage(): string {
          return `Release year must be a valid year and cannot be in the future.`;
        },
      },
    });
  };
}
