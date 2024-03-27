import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { QUEUE_LIST } from '@/jobs/queue-list';

const queueOptions: BullModuleOptions[] = [
  {
    name: QUEUE_LIST.AUTH,
  },
  {
    name: QUEUE_LIST.DEFAULT,
  },
];

@Module({
  imports: [ConfigModule, BullModule.registerQueue(...queueOptions)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
