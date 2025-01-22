import { PermissionPayload } from '@core/constants/permission.constant';
import { Permission } from '@modules/permission/entities/permission.schema';
import { ActionList } from '@core/constants/app.constant';

export const createPermissions = (items: Array<PermissionPayload>) => {
  const permissions: Partial<Permission>[] = [];

  items.forEach((item) => {
    item.actions.forEach((action) => {
      permissions.push({
        resource: item.resource,
        action: action as ActionList,
        name: `${action} ${item.resource}`,
        description: `${action} ${item.resource}`,
      });
    });
  });

  return permissions;
};

export const prepareConditionFindPermissions = (permissions: Partial<Permission>[]) => {
  return {
    $or: permissions.map((permission) => ({ action: permission.action, resource: permission.resource })),
  };
};

export const preparePermissionPayload = (permissions: Partial<Permission>[]) => {
  return permissions.map((permission) => `${permission.resource}:${permission.action}`);
};
