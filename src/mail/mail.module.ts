import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { QUEUE_LIST } from '@/jobs/queue-list';

const queueOptions: BullModuleOptions[] = [
  ...Object.values(QUEUE_LIST).map((queue) => ({
    name: queue,
  })),
];

@Module({
  imports: [ConfigModule, BullModule.registerQueue(...queueOptions)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
