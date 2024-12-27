import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async sendEmailVerification(email: string, token: string) {
    const url = `${this.configService.get('app.clientUrl', { infer: true })}/register/confirm?token=${token}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Email Verification',
        template: 'activation',
        context: {
          name: email.split('@')[0],
          url,
        },
      })
      .catch((err) => {
        this.logger.error('Error sending email verification');
        this.logger.error(err);
      });
  }

  async forgotPassword(email: string, token: string) {
    const url = `${this.configService.getOrThrow('app.clientUrl', { infer: true })}/reset-password?token=${token}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Reset your password',
        template: 'reset-password',
        context: {
          name: email.split('@')[0],
          url,
        },
      })
      .catch((err) => {
        this.logger.error('Error sending email request reset password');
        this.logger.error(err);
      });
  }
}
