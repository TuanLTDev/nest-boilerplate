import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '@core/decorators/http.decorators';
import { RoleResDto } from '@modules/role/dto/role.res.dto';
import { ValidateMongoId } from '@core/decorators/validators/mongo-id.validator';
import { CreateRoleDto } from '@modules/role/dto/create-role.dto';
import { PermissionGuard } from '@core/guards/permission.guard';
import { ActionList, ResourceList } from '@core/constants/app.constant';
import { Types } from 'mongoose';
import { RolePermissionResDto } from '@modules/role/dto/role-permission.res.dto';
import { RoleUserAssignedResDto } from '@modules/role/dto/role-user-assigned.res.dto';
import { AssignPermissionDto } from '@modules/role/dto/assign-permission.dto';
import { UpdateRoleDto } from '@modules/role/dto/update-role.dto';

@ApiTags('Role APIs')
@Controller('roles')
@UseGuards(PermissionGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiAuth({
    summary: 'Add a new role by admin',
    type: RoleResDto,
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.CREATE] }],
    statusCode: HttpStatus.CREATED,
  })
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.store(dto);
  }

  @ApiAuth({
    summary: 'Get all roles and number of user for each role',
    type: RoleResDto,
    isArray: true,
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.READ_ALL] }],
  })
  @Get()
  findAllRoleAndNoUserForEachRole() {
    return this.roleService.findAllRoleAndNoUserForEachRole();
  }

  @ApiAuth({
    summary: 'Get role information',
    type: RoleResDto,
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.READ] }],
  })
  @Get(':roleId')
  findOne(@Param('roleId', ValidateMongoId) roleId: string) {
    return this.roleService.findOneById(roleId);
  }

  @ApiAuth({
    summary: 'Get role and permissions',
    type: RolePermissionResDto,
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.READ] }],
  })
  @Get(':roleId/permissions')
  getRoleAndPermissions(@Param('roleId', ValidateMongoId) roleId: string) {
    return this.roleService.getRoleAndPermissions({ _id: new Types.ObjectId(roleId) });
  }

  @ApiAuth({
    summary: 'Assign permissions for role',
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.UPDATE] }],
  })
  @Post(':roleId/permissions')
  assignPermissionsForRole(@Param('roleId', ValidateMongoId) roleId: string, @Body() dto: AssignPermissionDto) {
    return this.roleService.assignPermissionsForRole(roleId, dto.permissions);
  }

  @ApiAuth({
    summary: 'Remove permissions for role',
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.UPDATE] }],
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Delete(':roleId/permissions')
  removePermissionsForRole(@Param('roleId', ValidateMongoId) roleId: string, @Body() dto: AssignPermissionDto) {
    return this.roleService.removePermissionsForRole(roleId, dto.permissions);
  }

  @ApiAuth({
    summary: 'Get role and users assigned',
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.READ] }],
    type: RoleUserAssignedResDto,
  })
  @Get(':roleId/users-assigned')
  getRoleAndUsersAssigned(@Param('roleId', ValidateMongoId) roleId: string) {
    return this.roleService.getRoleAndUsersAssigned({ _id: new Types.ObjectId(roleId) });
  }

  @ApiAuth({
    summary: 'Update role information by admin',
    type: RoleResDto,
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.UPDATE] }],
  })
  @Put(':roleId')
  update(@Param('roleId', ValidateMongoId) roleId: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.findByIdAndUpdate(roleId, dto);
  }

  @ApiAuth({
    summary: 'Delete role by admin',
    statusCode: HttpStatus.NO_CONTENT,
    permissions: [{ resource: ResourceList.ROLE, actions: [ActionList.DELETE] }],
  })
  @Delete(':roleId')
  remove(@Param('roleId', ValidateMongoId) roleId: string) {
    return this.roleService.remove(roleId);
  }
}
