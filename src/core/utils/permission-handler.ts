import { PermissionHandlerInterface } from '@core/interfaces/permission-handler.interface';
import { PermissionPayload } from '@core/constants/permission.constant';
import { ICurrentUser } from '@modules/auth/interfaces';

export class PermissionHandler implements PermissionHandlerInterface {
  constructor(private readonly permission: PermissionPayload) {}

  handle(user: ICurrentUser): boolean {
    const { resource, actions } = this.permission;
    if (user && user.role && user.permissions) {
      const setPermission = new Set(user.permissions);
      return actions.every((action) => setPermission.has(`${resource}:${action}`));
    }
    return false;
  }
}
