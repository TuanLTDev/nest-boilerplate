import { BaseResDto } from '@common/dto/base.res.dto';
import { Expose } from 'class-transformer';
import { ActionList } from '@core/constants/app.constant';
import { EnumField, StringField } from '@core/decorators/field.decorators';

@Expose()
export class PermissionResDto extends BaseResDto {
  @StringField()
  @Expose()
  name: string;

  @StringField()
  @Expose()
  resource: string;

  @EnumField(() => ActionList)
  @Expose()
  action: ActionList;

  @StringField()
  @Expose()
  description: string;
}
