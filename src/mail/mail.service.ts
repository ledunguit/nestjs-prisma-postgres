import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/modules/base/base.service';
import { AllConfigTypes } from 'src/types/config.type';
import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService extends BaseService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigTypes>,
  ) {
    super();
  }

  async sendRegisterConfirmationEmail(mailData: MailData<{ email: string; emailVerificationToken: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: this.t('common.confirm-email'),
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/verify/${mailData.data.emailVerificationToken}`,
      template: 'activation',
      context: {
        title: this.t('common.confirm-email'),
        url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/verify/${mailData.data.emailVerificationToken}`,
        actionTitle: this.t('common.confirm-email'),
        app_name: this.configService.get('app.name', { infer: true }),
        text1: this.t('email.register-confirm.text1'),
        text2: this.t('email.register-confirm.text2'),
        text3: this.t('email.register-confirm.text3'),
        text4: this.t('email.register-confirm.text4'),
        raw_url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/verify?email=${mailData.data.email}&email_verification_token=${mailData.data.emailVerificationToken}`,
      },
    });
  }
}
