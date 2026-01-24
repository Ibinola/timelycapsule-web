import { Processor, Process, OnQueueFailed, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Capsule, CapsuleStatus } from '../../capsules/entities/capsule.entity';
import { NotificationService } from '../../notifications/services/notification.service';
import { UNLOCK_QUEUE } from '../queues/unlock.queue';

@Processor(UNLOCK_QUEUE)
export class UnlockCapsulesProcessor {
  private readonly logger = new Logger(UnlockCapsulesProcessor.name);

  constructor(
    @InjectRepository(Capsule)
    private capsuleRepository: Repository<Capsule>,
    private notificationService: NotificationService,
  ) {}

  @Process('unlock-scheduled-capsules')
  async processUnlockJob(job: Job<{ batchSize?: number }>) {
    this.logger.log(`Processing unlock job ${job.id}`);
    
    const { batchSize = 100 } = job.data;
    const now = new Date();
    
    const capsules = await this.capsuleRepository.find({
      where: {
        status: CapsuleStatus.LOCKED,
        unlockAt: LessThanOrEqual(now),
      },
      relations: ['owner'],
      take: batchSize,
    });

    this.logger.log(`Found ${capsules.length} capsules to process`);

    const results = {
      unlocked: 0,
      failed: 0,
      capsuleIds: [] as string[],
    };

    for (const capsule of capsules) {
      try {
        await this.unlockCapsule(capsule);
        results.unlocked++;
        results.capsuleIds.push(capsule.id);
      } catch (error) {
        this.logger.error(`Failed to unlock capsule ${capsule.id}:`, error);
        results.failed++;
        
        // Requeue failed capsule for retry
        await job.queue.add('unlock-single-capsule', {
          capsuleId: capsule.id,
          attempt: 1,
        }, {
          delay: 60000, // Retry after 1 minute
          jobId: `retry-${capsule.id}-${Date.now()}`,
        });
      }
    }

    // If there are more capsules to process, add another job
    if (capsules.length === batchSize) {
      await job.queue.add('unlock-scheduled-capsules', { batchSize });
    }

    return results;
  }

  @Process('unlock-single-capsule')
  async processSingleCapsule(job: Job<{ capsuleId: string; attempt: number }>) {
    const { capsuleId, attempt } = job.data;
    
    this.logger.log(`Unlocking single capsule: ${capsuleId} (attempt ${attempt})`);
    
    const capsule = await this.capsuleRepository.findOne({
      where: { id: capsuleId },
      relations: ['owner'],
    });

    if (!capsule) {
      throw new Error(`Capsule ${capsuleId} not found`);
    }

    if (capsule.status !== CapsuleStatus.LOCKED) {
      this.logger.warn(`Capsule ${capsuleId} is not in locked state`);
      return { skipped: true, status: capsule.status };
    }

    await this.unlockCapsule(capsule);
    
    return { success: true, capsuleId };
  }

  private async unlockCapsule(capsule: Capsule): Promise<void> {
    // Update capsule
    capsule.status = CapsuleStatus.UNLOCKED;
    capsule.unlockedAt = new Date();
    await this.capsuleRepository.save(capsule);

    // Send notification
    await this.sendUnlockNotification(capsule);
  }

  private async sendUnlockNotification(capsule: Capsule): Promise<void> {
    // Implementation similar to above
    const notificationData = {
      type: 'capsule_unlocked',
      title: 'Capsule Unlocked!',
      message: `Your capsule "${capsule.title}" is now available.`,
      capsuleId: capsule.id,
      userId: capsule.owner.id,
    };

    await this.notificationService.createInAppNotification(
      capsule.owner.id,
      notificationData
    );

    capsule.notified = true;
    await this.capsuleRepository.save(capsule);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.log(`Job ${job.id} completed: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed:`, error);
    
    // Alert monitoring system
    this.alertMonitoringSystem(job, error);
  }

  private alertMonitoringSystem(job: Job, error: Error): void {
    // Implement your monitoring system integration
    this.logger.error(`ALERT: Job ${job.id} failed with error: ${error.message}`);
  }
}