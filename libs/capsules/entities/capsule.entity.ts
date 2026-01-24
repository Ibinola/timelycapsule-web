import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum CapsuleStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  EXPIRED = 'expired',
  SCHEDULED = 'scheduled'
}

export enum CapsuleType {
  MEMORY = 'memory',
  MESSAGE = 'message',
  MEDIA = 'media',
  SURPRISE = 'surprise'
}

@Entity('capsules')
export class Capsule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: CapsuleType, default: CapsuleType.MEMORY })
  type: CapsuleType;

  @Column({ type: 'enum', enum: CapsuleStatus, default: CapsuleStatus.LOCKED })
  status: CapsuleStatus;

  @Column({ type: 'timestamp' })
  unlockAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  unlockedAt?: Date;

  @ManyToOne(() => User, user => user.capsules)
  owner: User;

  @Column('simple-array', { nullable: true })
  recipients?: string[]; // User IDs or emails

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: false })
  notified: boolean; // Whether unlock notification was sent

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to check if capsule should be unlocked
  shouldUnlock(): boolean {
    if (this.status !== CapsuleStatus.LOCKED && this.status !== CapsuleStatus.SCHEDULED) {
      return false;
    }
    return new Date() >= new Date(this.unlockAt);
  }

  // Helper method to unlock capsule
  unlock(): void {
    if (this.shouldUnlock()) {
      this.status = CapsuleStatus.UNLOCKED;
      this.unlockedAt = new Date();
    }
  }
}