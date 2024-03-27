import { Module } from '@nestjs/common';
import { AuthenticationMailProcessor } from '@/jobs/processors/authentication-mail.processor';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [AuthenticationMailProcessor],
  exports: [AuthenticationMailProcessor],
})
export class JobsModule {}
