import { ICurrentUser } from '@modules/auth/interfaces';

export interface PermissionHandlerInterface {
  handle(user: ICurrentUser): boolean;
}
