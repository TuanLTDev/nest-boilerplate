import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepositoryInterface } from '@modules/role/interfaces/role.repository.interface';
import { CreateRoleDto } from '@modules/role/dto/create-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleResDto } from '@modules/role/dto/role.res.dto';
import { ERROR_CODE } from '@core/constants/exception';
import { FilterQuery } from 'mongoose';
import { Role } from '@modules/role/entities/role.schema';
import { RolePermissionResDto } from '@modules/role/dto/role-permission.res.dto';
import { RoleUserAssignedResDto } from '@modules/role/dto/role-user-assigned.res.dto';
import { PermissionService } from '@modules/permission/permission.service';
import { Optional } from '@core/utils/optional';
import { isCoreRoleSystem } from '@core/helper';
import { UpdateRoleDto } from '@modules/role/dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @Inject('RoleRepositoryInterface') private readonly roleRepository: RoleRepositoryInterface,
    private readonly permissionService: PermissionService,
  ) {}

  async store(dto: CreateRoleDto) {
    Optional.of(await this.findOneByName(dto.name)).throwIfExist(new ConflictException(ERROR_CODE.ROLE_NAME_EXIST));
    if (dto.permissions && dto.permissions.length > 0) {
      const isValid = await this.permissionService.validateMultiplePermissions(dto.permissions);
      if (!isValid) {
        throw new BadRequestException(ERROR_CODE.PERMISSION_INVALID);
      }
    }

    return this.roleRepository.create(dto);
  }

  async findAllRoleAndNoUserForEachRole() {
    return this.roleRepository.findAllRoleAndNoUserForEachRole();
  }

  async findAll() {
    const roles = await this.roleRepository.findAll({}, { lean: true });
    return plainToInstance(RoleResDto, roles);
  }

  async findOneById(id: string) {
    return this.roleRepository.findOneById(id, { lean: true });
  }

  async findOneByName(name: string) {
    const regexName = new RegExp(`${name}`, 'i');
    return this.roleRepository.findOneByCondition({ name: { $regex: regexName } }, { lean: true });
  }

  async getRoleAndPermissions(filter: FilterQuery<Role>) {
    const role = Optional.of(await this.roleRepository.getRoleAndPermissions(filter))
      .throwIfNullable(new NotFoundException(ERROR_CODE.ROLE_NOT_FOUND))
      .get();

    return plainToInstance(RolePermissionResDto, role, { excludeExtraneousValues: true });
  }

  async getRoleAndUsersAssigned(filter: FilterQuery<Role>) {
    const role = await this.roleRepository.getRoleAndUsersAssigned(filter);

    return plainToInstance(RoleUserAssignedResDto, role, { excludeExtraneousValues: true });
  }

  async findByIdAndUpdate(id: string, dto: UpdateRoleDto) {
    const role = Optional.of(await this.findOneById(id))
      .throwIfNullable(new NotFoundException(ERROR_CODE.ROLE_NOT_FOUND))
      .get() as Role;

    if (dto.name) {
      if (isCoreRoleSystem(role.name)) {
        throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
      }

      const regexName = new RegExp(`${dto.name}`, 'i');
      Optional.of(
        await this.roleRepository.findOneByCondition({
          name: { $regex: regexName },
          _id: { $ne: id },
        }),
      ).throwIfExist(new ConflictException(ERROR_CODE.ROLE_NAME_EXIST));
    }

    if (dto.permissions && dto.permissions.length > 0) {
      const isValid = await this.permissionService.validateMultiplePermissions(dto.permissions);
      if (!isValid) {
        throw new BadRequestException(ERROR_CODE.PERMISSION_INVALID);
      }
    }

    return Optional.of(
      await this.roleRepository.findByIdAndUpdate(id, dto, {
        lean: true,
        new: true,
      }),
    )
      .throwIfNullable(new NotFoundException(ERROR_CODE.ROLE_NOT_FOUND))
      .get() as Role;
  }

  async assignPermissionsForRole(roleId: string, permissionIds: string[]) {
    Optional.of(await this.roleRepository.findOneById(roleId, { lean: true })).throwIfNullable(
      new NotFoundException(ERROR_CODE.ROLE_NOT_FOUND),
    );

    const isValid = await this.permissionService.validateMultiplePermissions(permissionIds);
    if (!isValid) {
      throw new BadRequestException(ERROR_CODE.PERMISSION_INVALID);
    }

    return this.roleRepository.findByIdAndUpdate(
      roleId,
      { $addToSet: { permissions: permissionIds } },
      {
        lean: true,
        new: true,
      },
    );
  }

  async removePermissionsForRole(roleId: string, permissionIds: string[]) {
    Optional.of(await this.roleRepository.findOneById(roleId, { lean: true })).throwIfNullable(
      new NotFoundException(ERROR_CODE.ROLE_NOT_FOUND),
    );

    const isValid = await this.permissionService.validateMultiplePermissions(permissionIds);
    if (!isValid) {
      throw new BadRequestException(ERROR_CODE.PERMISSION_INVALID);
    }

    return this.roleRepository.findByIdAndUpdate(
      roleId,
      { $pull: { permissions: { $in: permissionIds } } },
      {
        lean: true,
        new: true,
      },
    );
  }

  async remove(id: string) {
    const role = Optional.of(await this.findOneById(id))
      .throwIfNullable(new NotFoundException(ERROR_CODE.ROLE_NOT_FOUND))
      .get() as Role;

    if (isCoreRoleSystem(role.name)) {
      throw new ForbiddenException(ERROR_CODE.ACCESS_DENIED);
    }

    return this.roleRepository.permanentlyDelete(id);
  }
}
