import { BaseResDto } from '@common/dto/base.res.dto';
import { EmailField, StringField, StringFieldOptional } from '@core/decorators/field.decorators';
import { Expose } from 'class-transformer';

@Expose()
export class BaseUserResDto extends BaseResDto {
  @EmailField()
  @Expose()
  email: string;

  @StringField()
  @Expose()
  displayName: string;

  @StringFieldOptional()
  @Expose()
  avatar?: string;
}
