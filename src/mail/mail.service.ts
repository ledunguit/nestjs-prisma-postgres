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
    await this.authQueue.add('confirmation-mail', { mailData, lang });
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
      subject: this.i18nService.translate('common.confirm-email', { lang }),
      text: `${this.configService.get('app.frontendDomain', {
        infer: true,
      })}/verify/${mailData.data.emailVerificationToken}`,
      template: 'activation',
      context: {
        title: this.i18nService.translate('common.confirm-email', { lang }),
        url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/verify/${mailData.data.emailVerificationToken}`,
        actionTitle: this.i18nService.translate('common.confirm-email', { lang }),
        app_name: this.configService.get('app.name', { infer: true }),
        text1: this.i18nService.translate('email.register-confirm.text1', { lang }),
        text2: this.i18nService.translate('email.register-confirm.text2', { lang }),
        text3: this.i18nService.translate('email.register-confirm.text3', { lang }),
        text4: this.i18nService.translate('email.register-confirm.text4', { lang }),
        raw_url: `${this.configService.get('app.frontendDomain', {
          infer: true,
        })}/verify?email=${mailData.data.email}&email_verification_token=${mailData.data.emailVerificationToken}`,
      },
    });
  }
}
