import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { Capsule } from './entities/capsule.entity';
import { CapsuleService } from './services/capsule.service';
import { UnlockSchedulerService } from './services/unlock-scheduler.service';
import { UnlockCapsulesProcessor } from './jobs/unlock-capsules.processor';
import { NotificationModule } from '../notifications/notification.module';
import { UNLOCK_QUEUE, UnlockQueueModule } from '../shared/queues/unlock.queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Capsule]),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    UnlockQueueModule,
    NotificationModule,
  ],
  providers: [
    CapsuleService,
    UnlockSchedulerService,
    UnlockCapsulesProcessor,
  ],
  exports: [CapsuleService, UnlockSchedulerService],
})
export class CapsuleModule {}