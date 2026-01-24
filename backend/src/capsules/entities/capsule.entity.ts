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

@Entity('capsules')
export class Capsule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

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
}