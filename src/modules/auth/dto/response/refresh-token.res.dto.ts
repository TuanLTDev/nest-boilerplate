import { TokenField } from '@core/decorators/field.decorators';

export class RefreshTokenResDto {
  @TokenField()
  accessToken: string;

  @TokenField()
  refreshToken: string;
}
