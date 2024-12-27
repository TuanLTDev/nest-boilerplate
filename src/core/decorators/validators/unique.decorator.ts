import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, Schema } from 'mongoose';
import { User, UserDocument } from '@modules/user/entities/user.schema';
import { BaseEntity } from '@database/entities/base/base.entity';

@ValidatorConstraint({ name: 'unique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) {}

  public async validate<E>(_value: string, args: IUniqueValidationArguments<E>): Promise<boolean> {
    const [entityClass, findCondition] = args.constraints;

    return (await this.model.countDocuments(findCondition)) <= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    const [entityClass] = args.constraints;
    const entity = entityClass.name || 'Entity';

    return `${entity} with the same ${args.property} already exists`;
  }
}

type UniqueValidationConstraints<E> = [
  Model<E> | Schema<E> | string,
  (validationArguments: ValidationArguments) => QueryOptions<E>,
];

interface IUniqueValidationArguments<E> extends ValidationArguments {
  constraints: UniqueValidationConstraints<E>;
}

export function Unique<E extends BaseEntity>(
  constraints: Partial<UniqueValidationConstraints<E>>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints,
      validator: UniqueValidator,
    });
  };
}
