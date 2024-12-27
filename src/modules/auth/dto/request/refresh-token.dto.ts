import { TokenField } from '@core/decorators/field.decorators';

export class RefreshTokenDto {
  @TokenField()
  readonly refreshToken: string;
}
