import { DEFAULT_PASSWORD } from '@core/constants/app.constant';
import { Types } from 'mongoose';
import { EmailField, MongoIdField, PasswordField, StringFieldOptional } from '@core/decorators/field.decorators';

export class CreateUserDto {
  @EmailField({ example: 'example@lutech.ltd' })
  email: string;

  @PasswordField({ example: DEFAULT_PASSWORD })
  password: string = DEFAULT_PASSWORD;

  @StringFieldOptional()
  displayName?: string;

  @MongoIdField({ example: new Types.ObjectId() })
  roleId: string;
}
