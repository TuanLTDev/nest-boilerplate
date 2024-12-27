import { MongoIdFieldOptional, StringField, StringFieldOptional } from '@core/decorators/field.decorators';
import { Types } from 'mongoose';
import { IsArrayDistinct } from '@core/decorators/validators/is-array-distinct.validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @StringField()
  name: string;

  @StringFieldOptional()
  description?: string;

  @MongoIdFieldOptional({ each: true, default: [new Types.ObjectId()] })
  @IsArrayDistinct({ message: 'permission id must contain unique values' })
  @Transform(({ obj }) => {
    return obj.permission_ids && typeof obj.permission_ids === 'string' ? [obj.permission_ids] : obj.permission_ids;
  })
  permissions?: string[];
}
