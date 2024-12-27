import { DEFAULT_PASSWORD } from '@core/constants/app.constant';
import { Types } from 'mongoose';
import {
  EmailFieldOptional,
  MongoIdFieldOptional,
  PasswordField,
  StringFieldOptional,
} from '@core/decorators/field.decorators';

export class UpdateUserDto {
  @EmailFieldOptional()
  email?: string;

  @PasswordField({ example: DEFAULT_PASSWORD })
  password?: string = DEFAULT_PASSWORD;

  @StringFieldOptional()
  displayName?: string;

  @MongoIdFieldOptional({ example: new Types.ObjectId() })
  roleId?: string;
}
