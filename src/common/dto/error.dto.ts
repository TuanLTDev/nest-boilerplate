import { Exclude, Expose } from 'class-transformer';
import { ErrorDetailDto } from '@common/dto/error-detail.dto';
import {
  BooleanField,
  ClassFieldOptional,
  NumberField,
  StringField,
  StringFieldOptional,
} from '@core/decorators/field.decorators';

@Exclude()
export class ErrorDto {
  @StringField({ example: new Date().toISOString() })
  @Expose()
  timestamp: string;

  @BooleanField()
  @Expose()
  status: boolean = false;

  @NumberField()
  @Expose()
  statusCode: number;

  @StringField()
  @Expose()
  error: string;

  @StringFieldOptional()
  @Expose()
  errorCode?: string;

  @StringField()
  @Expose()
  message: string;

  @ClassFieldOptional(() => ErrorDetailDto, { isArray: true, each: true })
  @Expose()
  details?: ErrorDetailDto[];

  stack?: string;

  trace?: Error | unknown;
}
