import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidReleaseYear(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsValidReleaseYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const currentYear = new Date().getFullYear();
          return typeof value === 'number' && value <= currentYear;
        },
        defaultMessage() {
          return 'Release year cannot be in the future.';
        },
      },
    });
  };
}

export function IsValidGenre(validationOptions?: ValidationOptions) {
  const allowedGenres = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Romance',
    'Thriller',
    'Sci-Fi',
    'Fantasy',
    'Animation',
    'Documentary',
  ];

  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsValidGenre',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && allowedGenres.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.value} is not a valid genre.`;
        },
      },
    });
  };
}

export function NoLeadingSpace(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'NoLeadingSpace',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && !/^\s/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not start with a space.`;
        },
      },
    });
  };
}
