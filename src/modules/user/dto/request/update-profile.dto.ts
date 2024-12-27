import {
  ClassFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
  URLFieldOptional,
} from '@core/decorators/field.decorators';

export class UpdateProfileDto {
  @StringFieldOptional()
  firstName?: string;

  @StringFieldOptional()
  lastName?: string;

  @StringFieldOptional()
  displayName?: string;

  @NumberFieldOptional()
  gender?: number;

  @ClassFieldOptional(() => Date)
  dateOfBirth?: Date;

  @URLFieldOptional()
  avatarUrl?: string;

  @URLFieldOptional()
  coverImageUrl?: string;

  @StringFieldOptional()
  phoneNumber?: string;

  @StringFieldOptional()
  address?: string;
}
