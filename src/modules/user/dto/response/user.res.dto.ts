import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseResDto } from '@common/dto/base.res.dto';
import { WrapperType } from '@common/types';
import { RoleResDto } from '@modules/role/dto/role.res.dto';
import {
  BooleanFieldOptional,
  ClassFieldOptional,
  EmailField,
  NumberField,
  NumberFieldOptional,
  StringFieldOptional,
  URLFieldOptional,
} from '@core/decorators/field.decorators';
import { Permission } from '@modules/permission/entities/permission.schema';

@Expose()
export class UserResDto extends BaseResDto {
  @EmailField()
  @Expose()
  email?: string;

  @Exclude()
  password?: string;

  @Exclude()
  resetPasswordToken?: string;

  @ClassFieldOptional(() => RoleResDto)
  @Expose()
  role?: WrapperType<RoleResDto>;

  @BooleanFieldOptional()
  @Expose()
  emailConfirmed?: boolean;

  @NumberFieldOptional()
  @Expose()
  accessFailedCount: number;

  @StringFieldOptional()
  @Expose()
  firstName: string;

  @StringFieldOptional()
  @Expose()
  lastName: string;

  @StringFieldOptional()
  @Expose()
  displayName: string;

  @NumberField()
  @Expose()
  gender: number;

  @ClassFieldOptional(() => Date)
  @Expose()
  dateOfBirth: Date;

  @URLFieldOptional()
  @Expose()
  avatarUrl: string;

  @URLFieldOptional()
  @Expose()
  coverImageUrl: string;

  @StringFieldOptional()
  @Expose()
  phoneNumber?: string;

  @StringFieldOptional()
  @Expose()
  address: string;

  @BooleanFieldOptional()
  @Expose()
  lockoutEnabled: boolean;

  @ClassFieldOptional(() => Date)
  @Expose()
  lockoutEnd?: Date;

  @StringFieldOptional({ each: true, isArray: true })
  @Transform(({ obj }) => {
    const permissions = (obj.role?.permissions as Permission[]) || [];

    return permissions.length > 0
      ? permissions.map((permission) => `${permission.resource}:${permission.action}`)
      : undefined;
  })
  @Expose()
  permissions?: Array<string>;
}
