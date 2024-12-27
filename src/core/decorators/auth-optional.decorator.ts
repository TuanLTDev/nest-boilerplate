import { SetMetadata } from '@nestjs/common';
import { IS_AUTH_OPTIONAL } from '@core/constants/app.constant';

export const AuthOptional = () => SetMetadata(IS_AUTH_OPTIONAL, true);
