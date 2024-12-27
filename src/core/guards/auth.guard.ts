import { IS_AUTH_OPTIONAL, IS_PUBLIC } from '@core/constants/app.constant';
import { JwtUtil } from '@core/utils/jwt.util';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ERROR_CODE } from '@core/constants/exception';
import { AuthService } from '@modules/auth/auth.service';
import { JwtAccessPayloadType } from '@modules/auth/types/jwt-access-payload.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtUtil: JwtUtil,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    const isAuthOptional = this.reflector.getAllAndOverride<boolean>(IS_AUTH_OPTIONAL, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);

    if (isAuthOptional && !accessToken) {
      return true;
    }

    if (accessToken === undefined || accessToken === null) {
      throw new UnauthorizedException(ERROR_CODE.UNAUTHORIZED);
    }
    const payload = this.jwtUtil.decode(accessToken) as JwtAccessPayloadType;
    if (!payload || !this.jwtUtil.isAccessPayload(payload)) {
      throw new UnauthorizedException(ERROR_CODE.TOKEN_INVALID);
    }

    const secretKey = (await this.authService.getSecretKey(payload.sessionId, 'access')) as string;

    request['user'] = await this.jwtUtil.verifyAccessToken(accessToken, secretKey);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
