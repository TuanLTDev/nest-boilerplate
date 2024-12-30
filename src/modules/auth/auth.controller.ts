import { Body, Controller, Delete, Get, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReqDto } from '@modules/auth/dto/request/login.req.dto';
import { ApiTags } from '@nestjs/swagger';
import { Fingerprint, type IFingerprint } from 'nestjs-fingerprint';
import { DeviceMetadata, ICurrentUser } from '@modules/auth/interfaces';
import { LoginResDto } from '@modules/auth/dto/response/login.res.dto';
import { RefreshTokenResDto } from '@modules/auth/dto/response/refresh-token.res.dto';
import { JwtRefreshGuard } from '@core/guards/jwt-refresh.guard';
import { RefreshTokenDto } from '@modules/auth/dto/request/refresh-token.dto';
import { ApiAuth, ApiPublic } from '@core/decorators/http.decorators';
import { RefreshToken } from '@core/decorators/refresh-token.decorator';
import { CurrentUser } from '@core/decorators/current-user.decorator';
import { JwtRefreshPayloadType } from '@modules/auth/types/jwt-refresh-payload.type';
import { ForgotPasswordDto } from '@modules/auth/dto/request/forgot-password.dto';
import { TokenDto } from '@modules/auth/dto/request/token.dto';
import { ResetPasswordDto } from '@modules/auth/dto/request/reset-password.dto';

@ApiTags('Auth APIs')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPublic({ summary: 'get fingerprints' })
  @Post('finger-print')
  getFingerPrint(@Fingerprint() fp: IFingerprint, @Req() req: any) {
    return { f1: fp, f2: req.fp };
  }

  @ApiPublic({
    summary: 'Login into the system',
    type: LoginResDto,
  })
  @Post('login')
  login(@Fingerprint() fp: IFingerprint, @Body() dto: LoginReqDto) {
    const deviceMetadata: DeviceMetadata = fp;
    return this.authService.login(dto, deviceMetadata);
  }

  @ApiPublic({
    summary: 'Refresh access token',
    type: RefreshTokenResDto,
    errorResponses: [400, 401, 403, 500],
  })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  refreshToken(@Body() dto: RefreshTokenDto, @RefreshToken() payload: JwtRefreshPayloadType) {
    return this.authService.refreshToken(payload);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Get('logout')
  logout(@CurrentUser() user: ICurrentUser) {
    return this.authService.logout(user);
  }

  @ApiAuth({
    summary: 'logout on other devices',
    errorResponses: [400, 401, 403, 500],
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Delete('revoke-token')
  revokeToken(@CurrentUser() user: ICurrentUser) {
    return this.authService.revokeToken(user);
  }

  @ApiPublic({
    summary: 'Request reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiPublic({
    summary: 'Verify token reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Get('verify-token-reset-password')
  verifyResetPassword(@Query() dto: TokenDto) {
    return this.authService.verifyTokenResetPassword(dto);
  }

  @ApiPublic({
    summary: 'Reset password',
    statusCode: HttpStatus.NO_CONTENT,
  })
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
