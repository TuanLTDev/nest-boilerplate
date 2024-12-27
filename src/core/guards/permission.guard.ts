import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ICurrentUser } from '@modules/auth/interfaces';
import { IS_PUBLIC, ROLE } from '@core/constants/app.constant';
import { Reflector } from '@nestjs/core';
import { PermissionHandlerInterface } from '@core/interfaces/permission-handler.interface';
import { CHECK_PERMISSION_KEY } from '@core/decorators/permission.decorator';
import { ERROR_CODE } from '@core/constants/exception';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * check if user authorized
   * @param context
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC, context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;

    if (user.role === ROLE.ADMIN) return true;

    const permissionHandlers =
      this.reflector.get<PermissionHandlerInterface[]>(CHECK_PERMISSION_KEY, context.getHandler()) ?? [];

    const permitted = permissionHandlers.every((handler) => handler.handle(user));

    if (!permitted) {
      throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
    }
    return permitted;
  }
}
