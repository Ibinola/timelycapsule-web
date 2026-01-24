import { Injectable } from '@nestjs/common';
import { Capsule } from './entities/capsule.entity';

@Injectable()
export class CapsuleUtilsService {
  /**
   * Checks if a capsule is currently unlocked based on its unlock date
   * @param capsule The capsule to check
   * @returns boolean indicating if the capsule is unlocked
   */
  isCapsuleUnlocked(capsule: Capsule): boolean {
    if (!capsule.unlockDate) {
      // If no unlock date is set, the capsule is immediately accessible
      return true;
    }

    const now = new Date();
    const unlockTime = new Date(capsule.unlockDate);

    // If unlock time has passed, the capsule is unlocked
    return now >= unlockTime;
  }

  /**
   * Gets the remaining time until a capsule unlocks
   * @param capsule The capsule to check
   * @returns Object with time remaining in various units, or null if already unlocked or no unlock date
   */
  getTimeRemaining(capsule: Capsule): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMilliseconds: number;
  } | null {
    if (!capsule.unlockDate || this.isCapsuleUnlocked(capsule)) {
      return null;
    }

    const now = new Date();
    const unlockTime = new Date(capsule.unlockDate);
    const timeDiff = unlockTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return null;
    }

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
      days: days,
      hours: hours % 24,
      minutes: minutes % 60,
      seconds: seconds % 60,
      totalMilliseconds: timeDiff,
    };
  }

  /**
   * Formats the remaining time into a human-readable string
   * @param timeRemaining Time remaining object from getTimeRemaining
   * @returns Formatted string like "2 days, 5 hours, 30 minutes"
   */
  formatTimeRemaining(timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null): string {
    if (!timeRemaining) {
      return '';
    }

    const parts = [];
    if (timeRemaining.days > 0) parts.push(`${timeRemaining.days} day${timeRemaining.days !== 1 ? 's' : ''}`);
    if (timeRemaining.hours > 0) parts.push(`${timeRemaining.hours} hour${timeRemaining.hours !== 1 ? 's' : ''}`);
    if (timeRemaining.minutes > 0) parts.push(`${timeRemaining.minutes} minute${timeRemaining.minutes !== 1 ? 's' : ''}`);
    
    if (parts.length === 0 && timeRemaining.seconds > 0) {
      parts.push(`${timeRemaining.seconds} second${timeRemaining.seconds !== 1 ? 's' : ''}`);
    }

    if (parts.length === 0) {
      return 'Less than a second';
    }

    return parts.join(', ');
  }

  /**
   * Gets the status of a capsule based on its unlock date
   * @param capsule The capsule to check
   * @returns The appropriate status for the capsule
   */
  getCapsuleStatus(capsule: Capsule): 'active' | 'unlocked' | 'expired' {
    if (this.isCapsuleUnlocked(capsule)) {
      return 'unlocked';
    }
    return capsule.status; // Return the current status if still locked
  }

  /**
   * Determines if content should be accessible for a capsule
   * @param capsule The capsule to check
   * @returns boolean indicating if content should be accessible
   */
  isContentAccessible(capsule: Capsule): boolean {
    // Content is accessible if the capsule is unlocked OR if no unlock date is set
    return this.isCapsuleUnlocked(capsule);
  }
}