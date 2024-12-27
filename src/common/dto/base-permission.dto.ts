import { Expose } from 'class-transformer';
import { ClassFieldOptional, EnumField } from '@core/decorators/field.decorators';
import { ResourceList } from '@core/constants/app.constant';
import { BaseActionDto } from '@common/dto/base-action.dto';

@Expose()
export class BasePermissionDto {
  @EnumField(() => ResourceList)
  @Expose()
  resource: ResourceList;

  @ClassFieldOptional(() => BaseActionDto, { isArray: true, each: true })
  @Expose()
  actions: BaseActionDto[];
}
