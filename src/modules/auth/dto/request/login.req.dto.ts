import { EmailField, PasswordField } from '@core/decorators/field.decorators';

export class LoginReqDto {
  @EmailField()
  readonly email: string;

  @PasswordField()
  readonly password: string;
}
