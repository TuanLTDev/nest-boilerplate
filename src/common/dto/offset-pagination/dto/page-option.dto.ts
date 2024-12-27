import { IsInt, Max, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT, Order } from '@core/constants/app.constant';
import { EnumFieldOptional, NumberFieldOptional } from '@core/decorators/field.decorators';

export class PageOptionsDto {
  @EnumFieldOptional(() => Order, { default: Order.DESC })
  readonly order?: Order = Order.DESC;

  @NumberFieldOptional({ minimum: 1, default: DEFAULT_PAGE })
  @Min(1)
  @IsInt()
  readonly page?: number = DEFAULT_PAGE;

  @NumberFieldOptional({ minimum: 1, maximum: MAX_LIMIT, default: DEFAULT_LIMIT })
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  readonly limit?: number = DEFAULT_LIMIT;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
