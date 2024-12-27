import { Inject, Injectable } from '@nestjs/common';
import { PermissionRepositoryInterface } from '@modules/permission/interfaces/permission.repository.interface';
import { Permission } from '@modules/permission/entities/permission.schema';
import { FilterQuery } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { BasePermissionDto } from '@common/dto/base-permission.dto';

@Injectable()
export class PermissionService {
  constructor(@Inject('PermissionRepositoryInterface') private readonly repository: PermissionRepositoryInterface) {}

  async getAllPermission(filter: FilterQuery<Permission> = {}) {
    const permissions = await this.repository.getAllPermission(filter);

    return plainToInstance(BasePermissionDto, permissions, { excludeExtraneousValues: true });
  }

  async validateMultiplePermissions(permissionIds: string[]) {
    const permissionsCount = await this.repository.countDocuments({ _id: { $in: permissionIds } });

    return permissionIds.length === permissionsCount;
  }
}
