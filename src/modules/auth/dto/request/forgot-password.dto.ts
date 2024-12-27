import { EmailField } from '@core/decorators/field.decorators';

export class ForgotPasswordDto {
  @EmailField()
  readonly email: string;
}
