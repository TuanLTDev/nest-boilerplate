import { IsDateString } from 'class-validator';
import { DateTime } from 'luxon';
import { StringFieldOptional } from '@core/decorators/field.decorators';

export class RangeDateDto {
  @StringFieldOptional({
    default: DateTime.now().setZone('UTC').startOf('month').toISODate(),
  })
  @IsDateString()
  from_date?: string = DateTime.now().setZone('UTC').startOf('month').toISODate();

  @StringFieldOptional({ default: DateTime.now().setZone('UTC').toISODate() })
  @IsDateString()
  to_date?: string = new Date().toISOString().slice(0, 10);
}
