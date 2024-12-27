import { TokenField } from '@core/decorators/field.decorators';

export class LoginResDto {
  @TokenField()
  accessToken: string;

  @TokenField()
  refreshToken: string;
}
