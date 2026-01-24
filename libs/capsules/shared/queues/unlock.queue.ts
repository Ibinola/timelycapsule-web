import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

export const UNLOCK_QUEUE = 'unlockQueue';

export const UnlockQueueModule = BullModule.registerQueue({
  name: UNLOCK_QUEUE,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});