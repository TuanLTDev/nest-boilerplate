import { SameAs } from '@core/decorators/validators/same-as.decorator';
import { PasswordField } from '@core/decorators/field.decorators';
import { DEFAULT_PASSWORD } from '@core/constants/app.constant';

export class ChangePasswordReqDto {
  @PasswordField({ example: DEFAULT_PASSWORD })
  old_password: string;

  @PasswordField({ example: DEFAULT_PASSWORD })
  new_password: string;

  @PasswordField({ example: DEFAULT_PASSWORD })
  @SameAs('new_password')
  confirm_new_password: string;
}
