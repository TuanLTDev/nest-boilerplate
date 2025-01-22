import { IsDateString } from 'class-validator';
import { StringFieldOptional } from '@core/decorators/field.decorators';

export class RangeDateDto {
  @StringFieldOptional()
  @IsDateString()
  from_date?: string;

  @StringFieldOptional()
  @IsDateString()
  to_date?: string;
}
