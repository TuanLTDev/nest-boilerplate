import { Expose } from 'class-transformer';
import { DateFieldOptional, MongoIdField } from '@core/decorators/field.decorators';

@Expose()
export class BaseResDto {
  @MongoIdField()
  @Expose()
  _id: string;

  @DateFieldOptional()
  @Expose()
  createdAt?: Date;

  @DateFieldOptional()
  @Expose()
  updatedAt?: Date;

  @DateFieldOptional({ default: null })
  @Expose()
  deletedAt?: Date = null;
}
