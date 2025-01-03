import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ROLE } from '@core/constants/app.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]): CustomDecorator => SetMetadata(ROLES_KEY, roles);
