import { BaseResDto } from '@common/dto/base.res.dto';
import { ClassFieldOptional, StringField, StringFieldOptional } from '@core/decorators/field.decorators';
import { Expose } from 'class-transformer';
import { BasePermissionDto } from '@common/dto/base-permission.dto';

@Expose()
export class RolePermissionResDto extends BaseResDto {
  @StringField()
  @Expose()
  name: string;

  @StringFieldOptional()
  @Expose()
  description?: string;

  @ClassFieldOptional(() => BasePermissionDto, { isArray: true, each: true })
  @Expose()
  permissions: BasePermissionDto[];
}
