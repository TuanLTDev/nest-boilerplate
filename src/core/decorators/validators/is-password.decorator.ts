import { registerDecorator, type ValidationOptions } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      propertyName: propertyName as string,
      name: 'isPassword',
      target: object.constructor,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return /^(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/.test(value);
        },
        defaultMessage() {
          return '$property must contain only letters, numbers, and at least one special character.';
        },
      },
    });
  };
}
