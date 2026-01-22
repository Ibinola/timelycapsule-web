import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capsule } from './entities/capsule.entity'; // Assumes entity exists

@Injectable()
export class CapsulesService {
  constructor(
    @InjectRepository(Capsule)
    private capsulesRepository: Repository<Capsule>,
  ) {}

  async findAll(userId: string) {
    const capsules = await this.capsulesRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    return capsules.map(capsule => this.sanitizeCapsule(capsule));
  }

  async findOne(id: string, userId: string) {
    const capsule = await this.capsulesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }

    return this.sanitizeCapsule(capsule);
  }

  private sanitizeCapsule(capsule: Capsule): Capsule {
    const now = new Date();
    // If unlock date is in the future, remove the content
    if (capsule.unlockDate && new Date(capsule.unlockDate) > now) {
      capsule.content = null; // Or '[LOCKED]'
      capsule.isLocked = true; // Helper flag for frontend
    } else {
      capsule.isLocked = false;
    }
    return capsule;
  }
}
