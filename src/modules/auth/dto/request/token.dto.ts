import { TokenField } from '@core/decorators/field.decorators';
import { IsNotEmpty } from 'class-validator';

export class TokenDto {
  @TokenField()
  @IsNotEmpty()
  token!: string;
}
