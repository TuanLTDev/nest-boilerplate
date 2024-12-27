import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { CreateUserDto } from '@modules/user/dto/request/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResDto } from '@modules/user/dto/response/user.res.dto';
import { ApiAuth } from '@core/decorators/http.decorators';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { ValidateMongoId } from '@core/decorators/validators/mongo-id.validator';
import { ChangePasswordReqDto } from '@modules/user/dto/request/change-password.dto';
import { UpdateProfileDto } from '@modules/user/dto/request/update-profile.dto';
import { UpdateUserDto } from '@modules/user/dto/request/update-user.dto';
import { PermissionGuard } from '@core/guards/permission.guard';
import { ActionList, ResourceList } from '@core/constants/app.constant';

@ApiTags('Users APIs')
@Controller('users')
@UseGuards(PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiAuth({
    summary: 'Add a new user by admin',
    description: 'Add a new user by admin',
    statusCode: HttpStatus.CREATED,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.CREATE] }],
  })
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiAuth({
    summary: 'Get all user',
    description: 'Get all user',
    type: UserResDto,
    isArray: true,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.READ_ALL] }],
  })
  @Get()
  findAll() {
    return this.userService.getAllUser();
  }

  @ApiAuth({
    summary: 'Get all user with shop assigned',
    isArray: true,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.READ_ALL] }],
  })
  @Get('shops-assign')
  findAllUserWithShopAssigned() {
    return this.userService.findAllUserWithShopAssigned();
  }

  @ApiAuth({
    summary: 'Get my information',
    type: UserResDto,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.READ] }],
  })
  @Get('me')
  getMyInfo(@CurrentUser('userId', ValidateMongoId) id: string) {
    return this.userService.findOneUserById(id);
  }

  @ApiAuth({
    summary: 'Update my profile',
    type: UserResDto,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.UPDATE] }],
  })
  @Put('me')
  updateMyProfile(@CurrentUser('userId', ValidateMongoId) userId: string, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @ApiAuth({
    summary: 'Get user information',
    description: 'Get user information',
    type: UserResDto,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.READ_ALL] }],
  })
  @Get(':userId')
  findOne(@Param('userId', ValidateMongoId) id: string): Promise<UserResDto> {
    return this.userService.findOneUserById(id);
  }

  @ApiAuth({
    summary: 'Update user information by admin',
    description: 'Update user information by admin',
    type: UserResDto,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.UPDATE_ANY] }],
  })
  @Put(':userId')
  updateOne(@Param('userId', ValidateMongoId) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUserByAdmin(id, dto);
  }

  @ApiAuth({
    summary: 'Delete a user by admin',
    description: 'Delete a user by admin',
    statusCode: HttpStatus.NO_CONTENT,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.DELETE] }],
  })
  @Delete(':userId')
  delete(@Param('userId', ValidateMongoId) id: string): Promise<boolean> {
    return this.userService.remove(id);
  }

  @ApiAuth({
    summary: 'Change password for current user',
    description: 'Change password for current user',
    statusCode: HttpStatus.NO_CONTENT,
    permissions: [{ resource: ResourceList.USER, actions: [ActionList.UPDATE] }],
  })
  @Post('/change-password')
  changePassword(@CurrentUser('userId') userId: string, @Body() dto: ChangePasswordReqDto) {
    return this.userService.changePassword(userId, dto);
  }
}
