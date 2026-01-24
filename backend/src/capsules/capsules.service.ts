import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capsule } from './entities/capsule.entity';

@Injectable()
export class CapsulesService {
  constructor(
    @InjectRepository(Capsule)
    private capsulesRepository: Repository<Capsule>,
  ) {}

  async findAll(userId: string) {
    const capsules = await this.capsulesRepository.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
    });

    // Apply time lock enforcement to each capsule
    const processedCapsules = [];
    for (const capsule of capsules) {
      const processedCapsule = await this.enforceTimeLock(capsule);
      processedCapsules.push(processedCapsule);
    }
    return processedCapsules;
  }

  async findOne(id: string, userId: string) {
    const capsule = await this.capsulesRepository.findOne({
      where: { id, ownerId: userId },
    });

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }

    return await this.enforceTimeLock(capsule);
  }

  /**
   * Enhanced time lock enforcement logic
   * On every capsule fetch:
   * - Compare current time with unlockAt
   * - If expired, update status to unlocked and record unlock time
   * - Handle edge cases like timezone differences and timing precision
   */
  private async enforceTimeLock(capsule: Capsule): Promise<Capsule> {
    const now = new Date();
    
    // Check if unlock date exists and compare with current time
    if (capsule.unlockDate) {
      const unlockTime = new Date(capsule.unlockDate);
      
      // If unlock time has passed, update status to unlocked if not already
      if (now >= unlockTime) {
        if (capsule.status !== 'unlocked') {
          capsule.status = 'unlocked';
          capsule.unlockedAt = now; // Record when it was unlocked
          
          // Save the updated status and unlock time back to the database
          await this.capsulesRepository.update(capsule.id, { 
            status: 'unlocked',
            unlockedAt: now
          });
        }
        
        // Unlock time has passed, make content accessible
        capsule.isLocked = false;
        capsule.lockedUntil = unlockTime; // Record the time it was supposed to unlock
      } else {
        // Unlock time has not passed, ensure capsule is locked
        capsule.isLocked = true;
        capsule.lockedUntil = unlockTime; // Record when it will be unlocked
        
        // Content should remain hidden until unlock time
        if (capsule.content && capsule.content !== '[LOCKED]') {
          capsule.content = '[LOCKED]'; // Hide content until unlock time
        }
      }
    } else {
      // If no unlock date is set, the capsule is immediately accessible
      capsule.isLocked = false;
      capsule.lockedUntil = undefined;
      capsule.status = capsule.status === 'active' ? 'active' : 'unlocked';
    }
    
    return capsule;
  }
}
