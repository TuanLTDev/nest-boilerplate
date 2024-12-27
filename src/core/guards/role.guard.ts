import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_CODE } from '@core/constants/exception';
import { ROLES_KEY } from '@core/decorators/role.decorator';
import { ROLE } from '@core/constants/app.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const isValid = requiredRoles.some((role) => user.role === role);
    if (!isValid) {
      throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
    }

    return isValid;
  }
}
