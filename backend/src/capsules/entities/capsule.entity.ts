import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('capsules')
export class Capsule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

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