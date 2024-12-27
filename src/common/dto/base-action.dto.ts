import { BaseResDto } from '@common/dto/base.res.dto';
import { Expose } from 'class-transformer';
import { EnumField, StringFieldOptional } from '@core/decorators/field.decorators';
import { ActionList, ResourceList } from '@core/constants/app.constant';

@Expose()
export class BaseActionDto extends BaseResDto {
  @EnumField(() => ActionList)
  @Expose()
  action: ActionList;

  @EnumField(() => ResourceList)
  @Expose()
  resource: ResourceList;

  @StringFieldOptional()
  @Expose()
  description: string;

  @StringFieldOptional()
  @Expose()
  name: string;
}
