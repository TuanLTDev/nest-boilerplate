import { SameAs } from '@core/decorators/validators/same-as.decorator';
import { PasswordField, TokenField } from '@core/decorators/field.decorators';

export class ResetPasswordDto {
  @PasswordField()
  password!: string;

  @PasswordField()
  @SameAs('password')
  confirmPassword!: string;

  @TokenField()
  token!: string;
}
