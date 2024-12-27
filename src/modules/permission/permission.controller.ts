import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from '@core/guards/permission.guard';
import { ApiAuth } from '@core/decorators/http.decorators';
import { ActionList, ResourceList } from '@core/constants/app.constant';
import { BasePermissionDto } from '@common/dto/base-permission.dto';

@ApiTags('Permission APIs')
@Controller('permissions')
@UseGuards(PermissionGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiAuth({
    summary: 'Get all permissions',
    permissions: [{ resource: ResourceList.PERMISSION, actions: [ActionList.READ_ALL] }],
    type: BasePermissionDto,
    isArray: true,
  })
  @Get()
  getAllPermission() {
    return this.permissionService.getAllPermission();
  }
}
