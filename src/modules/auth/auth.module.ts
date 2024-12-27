import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@modules/user/user.module';
import { CoreModule } from '@core/core.module';
import { MailModule } from '@/libs/mail/mail.module';
import { SessionModule } from '@modules/session/session.module';

@Module({
  imports: [UserModule, SessionModule, CoreModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
