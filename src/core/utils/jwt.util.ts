import { BadRequestException, Global, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { KeyPair } from '@common/types';
import { ERROR_CODE } from '@core/constants/exception';
import { JwtAccessPayloadType } from '@modules/auth/types/jwt-access-payload.type';
import { JwtRefreshPayloadType } from '@modules/auth/types/jwt-refresh-payload.type';
import { BaseTokenPayload, Token } from '@modules/auth/types/token.type';

@Global()
export class JwtUtil {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  extractBearerToken(token: string): string {
    return token.substring(7, token.length);
  }

  async verifyAccessToken(token: string, secret: string) {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (err) {
      this.handleError(err);
    }
  }

  verifyRefreshToken(token: string, secret: string) {
    try {
      return this.jwtService.verify(token, { secret });
    } catch (err) {
      this.handleError(err);
    }
  }

  decode(token: string): JwtAccessPayloadType | JwtRefreshPayloadType | any {
    try {
      return this.jwtService.decode(token);
    } catch {
      throw new UnauthorizedException();
    }
  }

  isAccessPayload(payload: JwtAccessPayloadType) {
    return payload.userId && payload.sessionId && payload.role;
  }

  isRefreshPayload(payload: JwtRefreshPayloadType) {
    return payload.sessionId;
  }

  async createToken(
    payload: {
      access: JwtAccessPayloadType;
      refresh: JwtRefreshPayloadType;
    },
    keyPair: KeyPair,
  ): Promise<Token> {
    const accessToken = this.jwtService.sign(payload.access, {
      secret: keyPair.publicKey,
      expiresIn: this.configService.getOrThrow<number>('auth.expires', {
        infer: true,
      }),
    });

    const refreshToken = this.jwtService.sign(payload.refresh, {
      secret: keyPair.privateKey,
      expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
        infer: true,
      }),
    });

    return {
      accessToken,
      refreshToken,
    } as Token;
  }

  async createVerificationToken(data: { id: string }): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
  }

  async createForgotPasswordToken(data: { id: string }): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.forgotExpires', {
          infer: true,
        }),
      },
    );
  }

  verifyActivateAccountToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new BadRequestException(ERROR_CODE.TOKEN_EXPIRED);
      } else if (err instanceof JsonWebTokenError) throw new BadRequestException(ERROR_CODE.TOKEN_INVALID);
    }
  }

  verifyResetPasswordToken(token: string): BaseTokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new BadRequestException(ERROR_CODE.TOKEN_EXPIRED);
      } else if (err instanceof JsonWebTokenError) throw new BadRequestException(ERROR_CODE.TOKEN_INVALID);
    }
  }

  handleError(e: Error) {
    if (e instanceof TokenExpiredError) {
      throw new UnauthorizedException(ERROR_CODE.TOKEN_EXPIRED);
    } else if (e instanceof JsonWebTokenError) throw new UnauthorizedException(ERROR_CODE.TOKEN_INVALID);
  }
}
