import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { DeviceService } from '@modules/session/services/device.service';
import { LoginReqDto } from '@modules/auth/dto/request/login.req.dto';
import { JwtUtil } from '@core/utils/jwt.util';
import { KeyPair } from '@common/types';
import { generateKeyPair } from '@core/utils/generate-key-pair.util';
import { DeviceMetadata, ICurrentUser } from '@modules/auth/interfaces';
import { ERROR_CODE } from '@core/constants/exception';
import { hashPassword, verifyPassword } from '@core/utils/password.util';
import { MailService } from '@/libs/mail/mail.service';
import { Optional } from '@core/utils/optional';
import { JwtAccessPayloadType } from '@modules/auth/types/jwt-access-payload.type';
import { JwtRefreshPayloadType } from '@modules/auth/types/jwt-refresh-payload.type';
import { ForgotPasswordDto } from '@modules/auth/dto/request/forgot-password.dto';
import { TokenDto } from '@modules/auth/dto/request/token.dto';
import { ResetPasswordDto } from '@modules/auth/dto/request/reset-password.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { createCacheKey } from '@/libs/redis/utils/cache.util';
import { CacheKey } from '@core/constants/cache.constant';
import { CacheTTL } from '@/libs/redis/utils/cache-ttl.util';
import { preparePermissionPayload } from '@modules/permission/helpers';
import { Permission } from '@modules/permission/entities/permission.schema';
import { User } from '@modules/user/entities/user.schema';
import { SessionService } from '@modules/session/services/session.service';
import { Session } from '@modules/session/entities/session.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly deviceService: DeviceService,
    private readonly jwtUtil: JwtUtil,
    private readonly sessionService: SessionService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {}

  async login(dto: LoginReqDto, deviceMetadata: DeviceMetadata) {
    const { email, password } = dto;
    const user: any = Optional.of(await this.userService.findOneByCondition({ email }))
      .throwIfNullable(new BadRequestException(ERROR_CODE.USER_NOT_FOUND))
      .get();

    const isMatchPassword = await verifyPassword(password, user.password);

    if (!isMatchPassword) {
      throw new BadRequestException(ERROR_CODE.INVALID_CREDENTIALS);
    }

    const device = await this.deviceService.createOrUpdate(deviceMetadata);
    const keyPair: KeyPair = generateKeyPair();

    const session = await this.sessionService.create({
      userId: user._id.toString(),
      deviceId: device._id.toString(),
      ...keyPair,
    });

    const accessTokenPayload: JwtAccessPayloadType = {
      userId: user._id.toString(),
      sessionId: session._id.toString(),
      role: user.role.name,
      permissions: preparePermissionPayload(user.role.permissions as Partial<Permission>[]),
    };

    const refreshTokenPayload: JwtRefreshPayloadType = {
      sessionId: session._id.toString(),
    };

    await this.setCacheSecretKeyAuthentication(keyPair, session._id.toString());

    return this.jwtUtil.createToken(
      {
        access: accessTokenPayload,
        refresh: refreshTokenPayload,
      },
      keyPair,
    );
  }

  async logout(user: ICurrentUser) {
    const session = Optional.of(await this.sessionService.findOneById(user.sessionId))
      .throwIfNullable(new UnauthorizedException(ERROR_CODE.TOKEN_INVALID))
      .get() as Session;

    await this.removeCacheSecretKeyAuthentication(user.sessionId);
    return this.sessionService.removeToken(session._id.toString());
  }

  async refreshToken(payload: JwtRefreshPayloadType) {
    const keyPair: KeyPair = generateKeyPair();
    const session = Optional.of(await this.sessionService.findByIdAndUpdate(payload.sessionId, keyPair))
      .throwIfNullable(new UnauthorizedException(ERROR_CODE.TOKEN_INVALID))
      .get() as Session;

    const user: any = Optional.of(await this.userService.findOneByCondition({ _id: session.userId }))
      .throwIfNullable(new NotFoundException(ERROR_CODE.USER_NOT_FOUND))
      .get();

    const accessTokenPayload: JwtAccessPayloadType = {
      userId: session.userId,
      sessionId: session._id.toString(),
      role: user.role.name,
      permissions: preparePermissionPayload(user.role.permissions as Partial<Permission>[]),
    };

    const refreshTokenPayload: JwtRefreshPayloadType = {
      sessionId: session._id.toString(),
    };

    await this.setCacheSecretKeyAuthentication(keyPair, session._id.toString());
    return this.jwtUtil.createToken(
      {
        access: accessTokenPayload,
        refresh: refreshTokenPayload,
      },
      keyPair,
    );
  }

  async getKeyPairBySessionId(sessionId: string): Promise<KeyPair> {
    const keyPair: KeyPair = Optional.of(await this.sessionService.findOneById(sessionId))
      .throwIfNullable(new UnauthorizedException(ERROR_CODE.TOKEN_INVALID))
      .get();

    await this.setCacheSecretKeyAuthentication(keyPair, sessionId);
    return keyPair;
  }

  async revokeToken(user: ICurrentUser) {
    await this.sessionService.revokeToken(user.userId, user.sessionId);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = Optional.of(await this.userService.findOneByCondition({ email: dto.email }))
      .throwIfNullable(new BadRequestException(ERROR_CODE.ACCOUNT_NOT_REGISTER))
      .get() as User;

    const token = await this.jwtUtil.createForgotPasswordToken({ id: user._id });

    await this.userService.updateOne({ _id: user._id }, { resetPasswordToken: token });
    await this.mailService.forgotPassword(dto.email, token);
  }

  async verifyTokenResetPassword(dto: TokenDto) {
    const payload = this.jwtUtil.verifyResetPasswordToken(dto.token);
    const user = Optional.of(await this.userService.findOneByCondition({ _id: payload.id }))
      .throwIfNullable(new BadRequestException(ERROR_CODE.ACCOUNT_NOT_REGISTER))
      .get() as User;

    if (user.resetPasswordToken !== dto.token) {
      throw new BadRequestException(ERROR_CODE.RESET_PASSWORD_TOKEN_USED);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    const payload = this.jwtUtil.verifyResetPasswordToken(dto.token);
    const user = Optional.of(await this.userService.findOneByCondition({ _id: payload.id }))
      .throwIfNullable(new BadRequestException(ERROR_CODE.ACCOUNT_NOT_REGISTER))
      .get() as User;

    if (user.resetPasswordToken !== dto.token) {
      throw new BadRequestException(ERROR_CODE.RESET_PASSWORD_TOKEN_USED);
    }

    const password = await hashPassword(dto.password);
    const token = await this.jwtUtil.createForgotPasswordToken({ id: user._id });

    const userUpdatedPassword = await this.userService.updateOne(
      { _id: user._id },
      {
        password,
        resetPasswordToken: token,
      },
    );

    if (userUpdatedPassword) {
      await this.sessionService.revokeToken(user._id);
    }
  }

  async setCacheSecretKeyAuthentication(keyPair: KeyPair, sessionId: string) {
    await this.cacheService.set(
      createCacheKey(CacheKey.SECRET_KEY_ACCESS_TOKEN, sessionId),
      keyPair.publicKey,
      CacheTTL.hours(4),
    );

    await this.cacheService.set(
      createCacheKey(CacheKey.SECRET_KEY_REFRESH_TOKEN, sessionId),
      keyPair.privateKey,
      CacheTTL.days(1),
    );
  }

  async removeCacheSecretKeyAuthentication(sessionId: string) {
    await this.cacheService.del(createCacheKey(CacheKey.SECRET_KEY_ACCESS_TOKEN, sessionId));
    await this.cacheService.del(createCacheKey(CacheKey.SECRET_KEY_REFRESH_TOKEN, sessionId));
  }

  async getSecretKey(sessionId: string, type: 'access' | 'refresh') {
    if (type === 'access') {
      return (
        (await this.cacheService.get(createCacheKey(CacheKey.SECRET_KEY_ACCESS_TOKEN, sessionId))) ??
        (await this.getKeyPairBySessionId(sessionId)).publicKey
      );
    } else if (type === 'refresh') {
      return (
        (await this.cacheService.get(createCacheKey(CacheKey.SECRET_KEY_REFRESH_TOKEN, sessionId))) ??
        (await this.getKeyPairBySessionId(sessionId)).privateKey
      );
    }
  }
}
