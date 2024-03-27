import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { QUEUE_LIST } from '@/jobs/queue-list';
import { Job } from 'bull';
import { MailService } from '@/mail/mail.service';

@Processor(QUEUE_LIST.AUTH)
@Injectable()
export class AuthenticationMailProcessor {
  constructor(private readonly mailService: MailService) {}

  @Process({
    name: 'confirmation-mail',
  })
  async sendConfirmationMail(job: Job) {
    await this.mailService.sendRegisterConfirmationEmail(job.data.lang, job.data.mailData);
  }

  @Process({
    name: 'forgot-password-mail',
  })
  async sendForgotPasswordMail(job: Job) {
    console.log('sendForgotPasswordMail', job.data);
  }
}
