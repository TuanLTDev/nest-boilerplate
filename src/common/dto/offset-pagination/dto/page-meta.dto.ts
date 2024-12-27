import { IPageMetaDtoParameters } from '@common/dto/offset-pagination/interface/page-meta-dto-parameter.interface';
import { BooleanField, NumberField } from '@core/decorators/field.decorators';

export class PageMetaDto {
  @NumberField()
  readonly page: number;

  @NumberField()
  readonly limit: number;

  @NumberField()
  readonly itemCount: number;

  @NumberField()
  readonly pageCount: number;

  @BooleanField()
  readonly hasPreviousPage: boolean;

  @BooleanField()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.limit = pageOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
