import { BaseResDto } from '@common/dto/base.res.dto';
import { NumberFieldOptional, StringField, StringFieldOptional } from '@core/decorators/field.decorators';
import { Expose } from 'class-transformer';

@Expose()
export class RoleResDto extends BaseResDto {
  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  description?: string;

  @NumberFieldOptional()
  @Expose()
  no_user_with_role?: number;
}
