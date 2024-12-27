import { OmitType } from '@nestjs/swagger';
import { RoleResDto } from '@modules/role/dto/role.res.dto';
import { Expose } from 'class-transformer';
import { ClassField } from '@core/decorators/field.decorators';
import { BaseUserResDto } from '@common/dto/base-user.res.dto';

@Expose()
export class RoleUserAssignedResDto extends OmitType(RoleResDto, ['no_user_with_role']) {
  @ClassField(() => BaseUserResDto, { each: true, isArray: true })
  @Expose()
  users: Array<BaseUserResDto>;
}
