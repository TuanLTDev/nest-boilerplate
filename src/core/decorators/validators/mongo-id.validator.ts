import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MONGOOSE_ID_OBJECT_FORMAT } from '@core/constants/app.constant';

@Injectable()
export class ValidateMongoId implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (MONGOOSE_ID_OBJECT_FORMAT.test(value)) return value;
    throw new BadRequestException('Id must be a mongo id');
  }
}
