import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from '@core/constants/app.constant';

export const Public = (isPublic = true): CustomDecorator => SetMetadata(IS_PUBLIC, isPublic);
