import { StringField, StringFieldOptional } from '@core/decorators/field.decorators';

export class ErrorDetailDto {
  @StringFieldOptional()
  property: string;

  @StringField()
  code: string;

  @StringField()
  message: string;
}
