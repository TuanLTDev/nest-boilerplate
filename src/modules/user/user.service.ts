import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserResDto } from '@modules/user/dto/response/user.res.dto';
import { plainToInstance } from 'class-transformer';
import { UserRepositoryInterface } from '@modules/user/interfaces/user.repository.interface';
import { UpdateUserDto } from '@modules/user/dto/request/update-user.dto';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '@modules/user/entities/user.schema';
import { ERROR_CODE } from '@core/constants/exception';
import { ChangePasswordReqDto } from '@modules/user/dto/request/change-password.dto';
import { hashPassword, verifyPassword } from '@core/utils/password.util';
import { CreateUserDto } from '@modules/user/dto/request/create-user.dto';
import { RoleService } from '@modules/role/role.service';
import { Optional } from '@core/utils/optional';
import { UpdateProfileDto } from '@modules/user/dto/request/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from '@modules/role/entities/role.schema';
import { Permission } from '@modules/permission/entities/permission.schema';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepositoryInterface,
    private readonly roleService: RoleService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto) {
    const { email, password, displayName, roleId } = dto;

    Optional.of(await this.findOneByCondition({ email })).throwIfExist(new ConflictException(ERROR_CODE.EMAIL_EXIST));
    Optional.of(await this.roleService.findOneById(roleId)).throwIfNullable(
      new BadRequestException(ERROR_CODE.ROLE_NOT_FOUND),
    );

    return this.userRepository.create({ email, password, role: roleId, displayName });
  }

  async getAllUser() {
    const users = await this.userRepository.findAll(
      {},
      {
        lean: true,
        sort: { createdAt: -1 },
        projection: '-password',
        populate: { path: 'role', model: Role.name, select: '_id name' },
      },
    );

    return plainToInstance(UserResDto, users);
  }

  async findOneUserById(id: string): Promise<UserResDto> {
    const user = Optional.of(
      await this.userRepository.findOneById(id, {
        populate: {
          path: 'role',
          model: Role.name,
          select: '_id name',
        },
        lean: true,
      }),
    )
      .throwIfNullable(new NotFoundException(ERROR_CODE.USER_NOT_FOUND))
      .get() as User;

    return plainToInstance(UserResDto, user);
  }

  async findOneByCondition(filter: FilterQuery<User>) {
    return this.userRepository.findOneByCondition(filter, {
      lean: true,
      populate: {
        path: 'role',
        model: Role.name,
        select: '_id name',
        populate: {
          path: 'permissions',
          model: Permission.name,
          select: '_id name action resource',
        },
      },
    });
  }

  async updateUserByAdmin(id: string, dto: UpdateUserDto) {
    const { email, password, displayName, roleId } = dto;

    if (email) {
      Optional.of(await this.findOneByCondition({ email, _id: { $ne: id } })).throwIfExist(
        new ConflictException(ERROR_CODE.EMAIL_EXIST),
      );
    }
    let role: Role;
    if (roleId) {
      role = Optional.of(await this.roleService.findOneById(roleId))
        .throwIfNullable(new BadRequestException(ERROR_CODE.ROLE_NOT_FOUND))
        .get();
    }

    const updateData: Partial<User> = {
      email,
      password,
      displayName,
      role: role._id.toString() ?? undefined,
    };

    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    const user = await this.userRepository.findByIdAndUpdate(id, updateData, { lean: true, new: true });

    return plainToInstance(UserResDto, user);
  }

  async updateOne(filter: FilterQuery<User>, dto: Partial<User>): Promise<UserResDto> {
    const user = Optional.of(
      await this.userRepository.findOneAndUpdate(filter, dto, {
        lean: true,
        new: true,
      }),
    )
      .throwIfNullable(new NotFoundException(ERROR_CODE.USER_NOT_FOUND))
      .get() as User;

    return plainToInstance(UserResDto, user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserResDto> {
    if (dto.phoneNumber) {
      Optional.of(await this.findOneByCondition({ phoneNumber: dto.phoneNumber, _id: { $ne: id } })).throwIfExist(
        new ConflictException(ERROR_CODE.PHONE_NUMBER_EXIST),
      );
    }

    const user = Optional.of(
      await this.userRepository.findByIdAndUpdate(id, dto, {
        lean: true,
        new: true,
      }),
    )
      .throwIfNullable(new NotFoundException(ERROR_CODE.USER_NOT_FOUND))
      .get() as User;

    return plainToInstance(UserResDto, user);
  }

  async remove(id: string) {
    return this.userRepository.softDelete(id);
  }

  async changePassword(userId: string, dto: ChangePasswordReqDto) {
    const user = Optional.of(await this.userRepository.findOneById(userId))
      .throwIfNullable(new NotFoundException(ERROR_CODE.USER_NOT_FOUND))
      .get() as User;

    const isMatchPassword = await verifyPassword(dto.old_password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException(ERROR_CODE.OLD_PASSWORD_INCORRECT);
    }

    const password = await hashPassword(dto.new_password);
    await this.userRepository.findByIdAndUpdate(userId, { password }, { lean: true, new: true });
  }
}
