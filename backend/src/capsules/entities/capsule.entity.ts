import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Adjust path as needed
} from 'typeorm';

@Entity('capsules')
export class Capsule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp', name: 'unlock_date' })
  unlockDate!: Date;

  @Column({ type: 'timestamp', name: 'created_at', nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: true })
  isLocked!: boolean;

  @ManyToOne(() => User, user => user.capsules)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;
  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'json', nullable: true })
  media?: any; // For storing media metadata

  @Column({ type: 'timestamp', nullable: true })
  unlockDate?: Date;

  @Column({
    type: 'enum',
    enum: ['active', 'unlocked', 'expired'],
    default: 'active',
  })
  status!: 'active' | 'unlocked' | 'expired';

  @Column({ type: 'enum', enum: ['public', 'private', 'draft'], default: 'draft' })
  type!: 'public' | 'private' | 'draft';

  @Column({ default: false })
  isLocked!: boolean;

  @Column({ name: 'ownerId', type: 'varchar', nullable: true })
  ownerId?: string;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date;

  @Column({ type: 'timestamp', nullable: true })
  unlockedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}