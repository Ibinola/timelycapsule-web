import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, Between } from 'typeorm';
import { Capsule, CapsuleStatus } from '../entities/capsule.entity';
import { NotificationService } from '../../notifications/services/notification.service';

@Injectable()
export class UnlockSchedulerService {
  private readonly logger = new Logger(UnlockSchedulerService.name);

  constructor(
    @InjectRepository(Capsule)
    private capsuleRepository: Repository<Capsule>,
    private notificationService: NotificationService,
  ) {}

  // Run every 5 minutes for high precision
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleUnlockCapsules() {
    this.logger.log('Starting capsule unlock job...');
    
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      // Find capsules that should be unlocked (past unlockAt time)
      const capsulesToUnlock = await this.capsuleRepository.find({
        where: {
          status: CapsuleStatus.LOCKED,
          unlockAt: LessThanOrEqual(now),
          // Add some buffer to catch capsules that might have been missed
          ...(fiveMinutesAgo && {
            unlockAt: Between(fiveMinutesAgo, now)
          })
        },
        relations: ['owner'],
        take: 100, // Process in batches
      });

      this.logger.log(`Found ${capsulesToUnlock.length} capsules to unlock`);

      if (capsulesToUnlock.length === 0) {
        return;
      }

      // Unlock capsules and send notifications
      const unlockedCapsules = [];
      const failedCapsules = [];

      for (const capsule of capsulesToUnlock) {
        try {
          // Update capsule status
          capsule.status = CapsuleStatus.UNLOCKED;
          capsule.unlockedAt = now;
          
          await this.capsuleRepository.save(capsule);
          
          // Send notification to owner
          await this.sendUnlockNotification(capsule);
          
          unlockedCapsules.push(capsule.id);
          this.logger.debug(`Unlocked capsule: ${capsule.id}`);
        } catch (error) {
          this.logger.error(`Failed to unlock capsule ${capsule.id}:`, error);
          failedCapsules.push({ capsuleId: capsule.id, error: error.message });
        }
      }

      this.logger.log(`Successfully unlocked ${unlockedCapsules.length} capsules`);
      
      if (failedCapsules.length > 0) {
        this.logger.warn(`Failed to unlock ${failedCapsules.length} capsules`);
        // You could implement retry logic here or log to monitoring system
      }

      // Log summary
      await this.logUnlockJobSummary(unlockedCapsules.length, failedCapsules.length);
      
    } catch (error) {
      this.logger.error('Unlock job failed:', error);
      throw error;
    }
  }

  // Run every hour to handle edge cases and retry failed unlocks
  @Cron(CronExpression.EVERY_HOUR)
  async handleStuckCapsules() {
    this.logger.log('Checking for stuck capsules...');
    
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const stuckCapsules = await this.capsuleRepository.find({
      where: {
        status: CapsuleStatus.LOCKED,
        unlockAt: LessThanOrEqual(twentyFourHoursAgo),
      },
      take: 50,
    });

    if (stuckCapsules.length > 0) {
      this.logger.warn(`Found ${stuckCapsules.length} capsules stuck in locked state`);
      
      for (const capsule of stuckCapsules) {
        try {
          capsule.status = CapsuleStatus.UNLOCKED;
          capsule.unlockedAt = new Date();
          await this.capsuleRepository.save(capsule);
          
          this.logger.log(`Force-unlocked stuck capsule: ${capsule.id}`);
        } catch (error) {
          this.logger.error(`Failed to force-unlock capsule ${capsule.id}:`, error);
        }
      }
    }
  }

  private async sendUnlockNotification(capsule: Capsule): Promise<void> {
    try {
      const notificationData = {
        type: 'capsule_unlocked',
        title: 'Your Capsule is Ready!',
        message: `"${capsule.title}" is now unlocked and ready to view.`,
        capsuleId: capsule.id,
        userId: capsule.owner.id,
        timestamp: new Date(),
      };

      // Send in-app notification
      await this.notificationService.createInAppNotification(
        capsule.owner.id,
        notificationData
      );

      // Send email notification (optional)
      if (capsule.owner.email) {
        await this.notificationService.sendEmail({
          to: capsule.owner.email,
          subject: 'Your Capsule Has Been Unlocked!',
          template: 'capsule-unlocked',
          data: {
            capsuleTitle: capsule.title,
            unlockDate: capsule.unlockedAt,
            viewLink: `/capsules/${capsule.id}`,
          },
        });
      }

      // Send push notification (optional)
      if (capsule.owner.deviceToken) {
        await this.notificationService.sendPushNotification({
          token: capsule.owner.deviceToken,
          title: 'Capsule Unlocked',
          body: `Your capsule "${capsule.title}" is ready!`,
          data: { capsuleId: capsule.id },
        });
      }

      capsule.notified = true;
      await this.capsuleRepository.save(capsule);
      
    } catch (error) {
      this.logger.error(`Failed to send notification for capsule ${capsule.id}:`, error);
      // Don't throw - we want to continue processing other capsules
    }
  }

  private async logUnlockJobSummary(successCount: number, failureCount: number): Promise<void> {
    // Log to database or monitoring service
    const summary = {
      timestamp: new Date(),
      successCount,
      failureCount,
      totalProcessed: successCount + failureCount,
      jobType: 'capsule_unlock',
    };

    this.logger.log(`Unlock job completed: ${JSON.stringify(summary)}`);
    
    // You could save this to a job_logs table
    // await this.jobLogRepository.save(summary);
  }

  // Manual trigger for testing or admin panel
  async unlockSingleCapsule(capsuleId: string): Promise<boolean> {
    try {
      const capsule = await this.capsuleRepository.findOne({
        where: { id: capsuleId },
        relations: ['owner'],
      });

      if (!capsule) {
        throw new Error(`Capsule ${capsuleId} not found`);
      }

      if (capsule.status !== CapsuleStatus.LOCKED) {
        throw new Error(`Capsule ${capsuleId} is not locked`);
      }

      capsule.status = CapsuleStatus.UNLOCKED;
      capsule.unlockedAt = new Date();
      
      await this.capsuleRepository.save(capsule);
      await this.sendUnlockNotification(capsule);
      
      this.logger.log(`Manually unlocked capsule: ${capsuleId}`);
      return true;
    } catch (error) {
      this.logger.error(`Manual unlock failed for capsule ${capsuleId}:`, error);
      throw error;
    }
  }

  // Get upcoming capsules to unlock (for monitoring)
  async getUpcomingUnlocks(hours: number = 24): Promise<Capsule[]> {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return this.capsuleRepository.find({
      where: {
        status: CapsuleStatus.LOCKED,
        unlockAt: Between(now, future),
      },
      order: {
        unlockAt: 'ASC',
      },
      take: 100,
    });
  }
}