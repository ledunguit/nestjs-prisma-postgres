import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/modules/base/base.service';
import { AllConfigTypes } from 'src/types/config.type';
import { MailData } from './interfaces/mail-data.interface';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_LIST } from '@/jobs/queue-list';
import { Queue } from 'bull';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class MailService extends BaseService {
  constructor(
    @InjectQueue(QUEUE_LIST.AUTH) private readonly authQueue: Queue,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigTypes>,
    private readonly i18nService: I18nService,
  ) {
    super();
  }

  async addRegisterConfirmationEmailJob(
    lang: string,
    mailData: MailData<{
      email: string;
      emailVerificationToken: string;
    }>,
  ) {
    await this.authQueue.add('confirmation-mail', { lang, mailData });
  }

  async sendRegisterConfirmationEmail(
    lang: string,
    mailData: MailData<{
      email: string;
      emailVerificationToken: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: this.i18nService.translate('auth.verify-email.title', { lang }),
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/verify/${mailData.data.emailVerificationToken}`,
      template: 'activation',
      context: {
        title: this.i18nService.translate('auth.verify-email.title', { lang }),
        url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/verify/${mailData.data.emailVerificationToken}`,
        actionTitle: this.i18nService.translate('auth.verify-email.verify-button', { lang }),
        app_name: this.configService.get('app.name', { infer: true }),
        text1: this.i18nService.translate('auth.verify-email.text1', { lang }),
        text2: this.i18nService.translate('auth.verify-email.text2', { lang }),
        text3: this.i18nService.translate('auth.verify-email.text3', { lang }),
        text4: this.i18nService.translate('auth.verify-email.text4', { lang }),
        raw_url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/verify?email=${mailData.data.email}&email_verification_token=${mailData.data.emailVerificationToken}`,
      },
    });
  }

  async addForgotPasswordEmailJob(
    lang: string,
    mailData: MailData<{
      email: string;
      passwordResetToken: string;
    }>,
  ) {
    await this.authQueue.add('forgot-password-mail', { lang, mailData });
  }

  async sendForgotPasswordEmail(
    lang: string,
    mailData: MailData<{
      email: string;
      passwordResetToken: string;
    }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: this.i18nService.translate('auth.forgot-password.title', { lang }),
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/forgot-password/${mailData.data.passwordResetToken}`,
      template: 'forgot-password',
      context: {
        title: this.i18nService.translate('auth.forgot-password.title', { lang }),
        url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/forgot-password/${mailData.data.passwordResetToken}`,
        actionTitle: this.i18nService.translate('auth.forgot-password.title', { lang }),
        app_name: this.configService.get('app.name', { infer: true }),
        text1: this.i18nService.translate('auth.forgot-password.text1', { lang }),
        text2: this.i18nService.translate('auth.forgot-password.text2', { lang }),
        text3: this.i18nService.translate('auth.forgot-password.text3', { lang }),
        text4: this.i18nService.translate('auth.forgot-password.text4', { lang }),
        raw_url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/forgot-password?email=${mailData.data.email}&password_reset_token=${mailData.data.passwordResetToken}`,
      },
    });
  }
}
