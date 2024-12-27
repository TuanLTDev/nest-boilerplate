import { JwtUtil } from '@core/utils/jwt.util';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@modules/auth/auth.service';
import { ERROR_CODE } from '@core/constants/exception';
import { JwtRefreshPayloadType } from '@modules/auth/types/jwt-refresh-payload.type';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtUtil: JwtUtil,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = this.extractRefreshTokenFromBody(request);

    const payload = this.jwtUtil.decode(refreshToken) as JwtRefreshPayloadType;
    if (!payload || !this.jwtUtil.isRefreshPayload(payload)) {
      throw new UnauthorizedException(ERROR_CODE.TOKEN_INVALID);
    }

    const secretKey = (await this.authService.getSecretKey(payload.sessionId, 'refresh')) as string;

    request['refresh-token'] = await this.jwtUtil.verifyRefreshToken(refreshToken, secretKey);
    return true;
  }

  private extractRefreshTokenFromBody(request: Request): string | undefined {
    return request.body?.refreshToken.trim();
  }
}
